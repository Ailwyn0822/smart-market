import { Controller, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EcpayService } from './ecpay.service';
import { OrdersService } from '../orders/orders.service';
import { OrderStatus, PaymentMethod } from '../orders/entities/order.entity';

@Controller('ecpay')
export class EcpayController {
    constructor(
        private readonly ecpayService: EcpayService,
        private readonly ordersService: OrdersService,
        private readonly configService: ConfigService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('checkout')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async createCheckout(@Body() body: any, @Req() req: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const userId: string = req.user?.sub || req.user?.id || req.user?.userId || '';

        // 先建立「待付款」訂單，取得訂單編號作為 MerchantTradeNo
        const order = await this.ordersService.createOrder(userId, {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            recipientName: body.recipientName || '',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            recipientEmail: body.recipientEmail || '',
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            shippingAddress: body.shippingAddress || '',
            paymentMethod: PaymentMethod.ONLINE,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            amount: body.amount,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
            items: body.items || [],
        }, OrderStatus.PENDING_PAYMENT);

        // 以訂單編號作為 MerchantTradeNo，讓 ReturnURL callback 能對應回訂單
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const html = this.ecpayService.generateAioCheckout(body, order.orderNumber);
        return { html, orderNumber: order.orderNumber };
    }

    // 綠界 Server-to-Server Callback（可靠，用這裡更新訂單狀態）
    @Post('return')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async handleECPayReturn(@Body() body: any) {
        console.log('ECPay Return: ', body);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const orderNumber = (body?.MerchantTradeNo as string) || '';
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const rtnCode = (body?.RtnCode as string) || '0';
        if (orderNumber) {
            await this.ordersService.handlePaymentCallback(orderNumber, rtnCode);
        }
        return '1|OK';
    }

    // 綠界前端結帳完成跳轉（POST）
    @Post('result')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleECPayResult(@Body() body: any, @Res() res: any) {
        console.log('ECPay Result: ', body);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const orderNumber = (body?.MerchantTradeNo as string) || '';
        const frontendUrl = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
        return res.redirect(`${frontendUrl}/order_completed?orderNumber=${orderNumber}`);
    }
}
