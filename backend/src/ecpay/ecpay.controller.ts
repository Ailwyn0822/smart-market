import { Controller, Post, Body, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { EcpayService } from './ecpay.service';
import { OrdersService } from '../orders/orders.service';
import { PaymentMethod } from '../orders/entities/order.entity';

@Controller('ecpay')
export class EcpayController {
    constructor(
        private readonly ecpayService: EcpayService,
        private readonly ordersService: OrdersService,
    ) { }

    @UseGuards(JwtAuthGuard)
    @Post('checkout')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async createCheckout(@Body() body: any, @Req() req: any) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const userId: string = req.user?.sub || req.user?.id || req.user?.userId || '';

        let orderNumber = '';
        if (userId) {
            try {
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
                });
                orderNumber = order.orderNumber;
            } catch (e) {
                console.error('Failed to create order before ECPay:', e);
            }
        }

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const html = this.ecpayService.generateAioCheckout(body);
        return { html, orderNumber };
    }

    // 綠界 Server-to-Server Callback
    @Post('return')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleECPayReturn(@Body() body: any) {
        console.log('ECPay Return: ', body);
        return '1|OK';
    }

    // 綠界前端結帳完成跳轉（POST）
    @Post('result')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleECPayResult(@Body() body: any, @Res() res: any) {
        console.log('ECPay Result: ', body);
        // MerchantTradeNo 就是我們建立時設定的 orderNumber
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const orderNumber = (body?.MerchantTradeNo as string) || '';
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return
        return res.redirect(`http://localhost:3000/order_completed?orderNumber=${orderNumber}`);
    }
}
