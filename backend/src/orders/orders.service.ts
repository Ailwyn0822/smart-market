import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order, OrderStatus, PaymentMethod } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';
import { CreateOrderDto } from './dto/create-order.dto';
import { Between } from 'typeorm';
import { In } from 'typeorm';
import { NotificationsService } from '../notifications/notifications.service';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private ordersRepo: Repository<Order>,
        @InjectRepository(OrderItem)
        private orderItemsRepo: Repository<OrderItem>,
        private notificationsService: NotificationsService,
    ) { }

    async createOrder(userId: string, dto: CreateOrderDto, status = OrderStatus.PROCESSING): Promise<Order> {
        const orderNumber = 'SM' + Date.now();

        const order = this.ordersRepo.create({
            orderNumber,
            userId,
            status,
            totalAmount: dto.amount,
            paymentMethod: dto.paymentMethod as PaymentMethod,
            recipientName: dto.recipientName,
            recipientEmail: dto.recipientEmail,
            shippingAddress: dto.shippingAddress,
            items: dto.items.map((i) => ({
                productId: i.productId,
                productName: i.name,
                productImageUrl: i.imageUrl,
                quantity: i.quantity,
                price: i.price,
                sellerId: i.sellerId, // 記錄賣家 ID
            })) as OrderItem[],
        });

        const savedOrder = await this.ordersRepo.save(order);

        // COD 下單時立即通知賣家（線上付款等付款回調再通知）
        if (dto.paymentMethod === PaymentMethod.COD && dto.items.length > 0) {
            const sellerId = dto.items[0].sellerId;
            if (sellerId) {
                this.notificationsService.createNotification(
                    sellerId,
                    `您有一筆新訂單 (${orderNumber})，請盡快處理！`,
                    'order_update',
                    savedOrder.id.toString()
                ).catch(e => console.error('Failed to notify seller for new COD order:', e));
            }
        }

        return savedOrder;
    }

    async handlePaymentCallback(orderNumber: string, rtnCode: string): Promise<void> {
        const order = await this.ordersRepo.findOne({ where: { orderNumber } });
        if (!order) return;

        if (rtnCode === '1') {
            // 付款成功 → 更新為處理中
            order.status = OrderStatus.PROCESSING;
            await this.ordersRepo.save(order);

            // 通知買家付款成功
            this.notificationsService.createNotification(
                order.userId,
                `您的訂單 (${order.orderNumber}) 付款成功，賣家將盡快為您處理！`,
                'order_update',
                order.id.toString()
            ).catch(e => console.error('Failed to notify buyer for payment success:', e));

            // 通知賣家有新訂單（線上付款完成後）
            if (order.items && order.items.length > 0) {
                const sellerId = order.items[0].sellerId;
                if (sellerId) {
                    this.notificationsService.createNotification(
                        sellerId,
                        `您有一筆新訂單 (${order.orderNumber})，買家已完成付款，請盡快處理！`,
                        'order_update',
                        order.id.toString()
                    ).catch(e => console.error('Failed to notify seller for payment success:', e));
                }
            }
        } else {
            // 付款失敗 → 刪除待付款訂單
            await this.orderItemsRepo.delete({ orderId: order.id });
            await this.ordersRepo.delete({ id: order.id });
        }
    }

    async getMyOrders(userId: string): Promise<Order[]> {
        return this.ordersRepo.find({
            where: { userId },
            order: { createdAt: 'DESC' },
        });
    }

    async getOrderById(userId: string, id: number): Promise<Order> {
        const order = await this.ordersRepo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'item')
            .where('order.id = :id', { id })
            .andWhere('(order.userId = :userId OR order.id IN (' +
                this.orderItemsRepo
                    .createQueryBuilder('subItem')
                    .select('subItem.orderId')
                    .where('subItem.sellerId = :sellerId')
                    .getQuery() + '))'
            )
            .setParameters({ id, userId, sellerId: userId })
            .getOne();

        if (!order) throw new NotFoundException('Order not found');
        return order;
    }

    async getSellingOrders(sellerId: string): Promise<Order[]> {
        // 取得包含該賣家商品的訂單
        const orders = await this.ordersRepo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'item')
            .where('order.id IN (' +
                this.orderItemsRepo
                    .createQueryBuilder('subItem')
                    .select('subItem.orderId')
                    .where('subItem.sellerId = :sellerId')
                    .getQuery() + ')'
            )
            .setParameters({ sellerId })
            .orderBy('order.createdAt', 'DESC')
            .getMany();

        return orders;
    }

    async updateOrderStatus(userId: string, orderId: number, status: string): Promise<Order> {
        // 為了簡單起見，如果此訂單中有該賣家的商品，或是該買家的訂單，即可更新整個訂單的狀態
        const targetOrder = await this.ordersRepo
            .createQueryBuilder('order')
            .leftJoin('order.items', 'item')
            .where('order.id = :orderId', { orderId })
            .andWhere('(order.userId = :userId OR item.sellerId = CAST(:sellerId AS uuid))', { userId, sellerId: userId })
            .getOne();

        if (!targetOrder) throw new NotFoundException('找不到此訂單，或您無權限修改');

        targetOrder.status = status as OrderStatus;
        const saved = await this.ordersRepo.save(targetOrder);

        // 發送通知邏輯
        const statusLabelMap: Record<string, string> = {
            processing: '處理中',
            shipped: '已出貨',
            out_for_delivery: '配送中',
            delivered: '已送達',
            pending_payment: '待付款',
        };
        const statusLabel = statusLabelMap[status] ?? status;

        try {
            // 如果是買家自己確認收貨，通知賣家
            if (userId === targetOrder.userId) {
                const sellerId = targetOrder.items.length > 0 ? targetOrder.items[0].sellerId : null;
                if (sellerId) {
                    await this.notificationsService.createNotification(
                        sellerId,
                        `買家已確認收貨您的訂單 (${targetOrder.orderNumber})`,
                        'order_update',
                        targetOrder.id.toString()
                    );
                }
            } else {
                // 如果是賣家出貨等操作，通知買家
                await this.notificationsService.createNotification(
                    targetOrder.userId,
                    `您的訂單 (${targetOrder.orderNumber}) 狀態已更新為：${statusLabel}`,
                    'order_update',
                    targetOrder.id.toString()
                );
            }
        } catch (e) {
            console.error('Failed to send notification:', e);
        }

        return saved;
    }

    // 買家申請取消
    async requestCancellation(userId: string, orderId: number): Promise<Order> {
        const order = await this.ordersRepo.findOne({ where: { id: orderId, userId } });
        if (!order) throw new NotFoundException('找不到此訂單或您無權限操作');
        if (order.status !== OrderStatus.PROCESSING) {
            throw new NotFoundException('只有處理中的訂單可申請取消');
        }
        order.status = OrderStatus.CANCEL_REQUESTED;
        order.cancelRequestedBy = 'buyer';
        const saved = await this.ordersRepo.save(order);

        // 通知賣家
        if (order.items.length > 0) {
            const sellerId = order.items[0].sellerId;
            await this.notificationsService.createNotification(
                sellerId,
                `買家申請取消訂單 (${order.orderNumber})，請進入訂單頁確認。`,
                'order_update',
                order.id.toString()
            ).catch(() => { });
        }
        return saved;
    }

    // 賣家同意/拒絕取消
    async respondCancellation(sellerId: string, orderId: number, approve: boolean): Promise<Order> {
        const order = await this.ordersRepo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'item')
            .where('order.id = :orderId', { orderId })
            .andWhere('item.sellerId = :sellerId', { sellerId })
            .getOne();
        if (!order) throw new NotFoundException('找不到此訂單或您無權限操作');
        if (order.status !== OrderStatus.CANCEL_REQUESTED) {
            throw new NotFoundException('此訂單目前不在待取消狀態');
        }

        if (approve) {
            order.status = OrderStatus.CANCELLED;
            await this.ordersRepo.save(order);
            await this.notificationsService.createNotification(
                order.userId,
                `您的訂單 (${order.orderNumber}) 已被賣家同意取消。`,
                'order_update',
                order.id.toString()
            ).catch(() => { });
        } else {
            order.status = OrderStatus.PROCESSING;
            order.cancelRequestedBy = null;
            await this.ordersRepo.save(order);
            await this.notificationsService.createNotification(
                order.userId,
                `您的訂單 (${order.orderNumber}) 取消申請已被賣家拒絕，訂單繼續進行中。`,
                'order_update',
                order.id.toString()
            ).catch(() => { });
        }
        return this.ordersRepo.findOne({ where: { id: orderId } }) as Promise<Order>;
    }

    async clearAll() {
        await this.orderItemsRepo.delete({});
        await this.ordersRepo.delete({});
        return { success: true, message: '所有訂單已清空' };
    }

    async getAllOrders(page = 1, limit = 20, keyword?: string, status?: string): Promise<{ items: Order[]; total: number }> {
        const qb = this.ordersRepo.createQueryBuilder('order')
            .leftJoinAndSelect('order.items', 'item')
            .orderBy('order.createdAt', 'DESC');

        if (keyword) {
            qb.andWhere('(order.orderNumber ILIKE :kw OR order.recipientEmail ILIKE :kw OR order.recipientName ILIKE :kw)', { kw: `%${keyword}%` });
        }
        if (status) {
            qb.andWhere('order.status = :status', { status });
        }

        const total = await qb.getCount();
        const items = await qb.skip((page - 1) * limit).take(limit).getMany();
        return { items, total };
    }

    async adminUpdateStatus(id: number, status: string): Promise<Order> {
        const order = await this.ordersRepo.findOne({ where: { id } });
        if (!order) throw new NotFoundException('Order not found');
        order.status = status as OrderStatus;
        return this.ordersRepo.save(order);
    }

    async getSellerDashboard(sellerId: string) {
        // 設定本月區間
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

        // 1. 本月總營收 (已付款或配送中以上的訂單，屬於該賣家的項目金額加總)
        const monthItems = await this.orderItemsRepo.createQueryBuilder('item')
            .leftJoin('item.order', 'order')
            .where('item.sellerId = :sellerId', { sellerId })
            .andWhere('order.createdAt BETWEEN :start AND :end', { start: firstDayOfMonth, end: lastDayOfMonth })
            .andWhere('order.status IN (:...statuses)', { statuses: ['processing', 'shipped', 'out_for_delivery', 'delivered'] })
            .getMany();

        const monthlyRevenue = monthItems.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
        const currentMonthSales = monthItems.reduce((sum, item) => sum + item.quantity, 0);

        // 2. 最熱銷商品排名 (Top 5)
        const topProductsRaw = await this.orderItemsRepo.createQueryBuilder('item')
            .select('item.productId', 'productId')
            .addSelect('item.productName', 'productName')
            .addSelect('item.productImageUrl', 'productImage')
            .addSelect('SUM(item.quantity)', 'totalSold')
            .where('item.sellerId = :sellerId', { sellerId })
            .andWhere('item.orderId IS NOT NULL')
            .groupBy('item.productId')
            .addGroupBy('item.productName')
            .addGroupBy('item.productImageUrl')
            .orderBy('"totalSold"', 'DESC')
            .limit(5)
            .getRawMany();

        // 3. 庫存短缺警示 (< 10)
        let lowStockAlerts: any[] = [];
        try {
            lowStockAlerts = await this.ordersRepo.manager.createQueryBuilder('Product', 'product')
                .select('product.id', 'id')
                .addSelect('product.name', 'name')
                .addSelect('product.stock', 'stock')
                .addSelect('product.imageUrl', 'imageUrl')
                .where('product.userId = :sellerId', { sellerId })
                .andWhere('product.stock <= 10')
                .andWhere('product.isActive = :isActive', { isActive: true })
                .orderBy('product.stock', 'ASC')
                .getRawMany();
        } catch (e) {
            console.error('Fetch low stock error:', e);
        }

        return {
            monthlyRevenue: Math.round(monthlyRevenue * 100) / 100,
            currentMonthSales,
            topProducts: topProductsRaw.map(p => ({
                productId: p.productId,
                productName: p.productName,
                productImage: p.productImage,
                totalSold: parseInt(p.totalSold, 10)
            })),
            lowStockAlerts: lowStockAlerts.map(p => ({
                productId: p.id,
                productName: p.name,
                productImage: p.imageUrl,
                stock: p.stock
            }))
        };
    }
}
