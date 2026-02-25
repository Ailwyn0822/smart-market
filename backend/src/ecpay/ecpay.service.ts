import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EcpayService {
    constructor(private configService: ConfigService) { }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    generateAioCheckout(orderData: any) {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const ECPayPayment = require('ecpay-aio-node');

        const merchantId = this.configService.get<string>('ECPAY_MERCHANT_ID') || '2000132';
        const hashKey = this.configService.get<string>('ECPAY_HASH_KEY') || '5294y06JbISpM5x9';
        const hashIv = this.configService.get<string>('ECPAY_HASH_IV') || 'v77hoKGq4kWxNNIS';

        // ecpay-aio-node 的 options 格式
        const options = {
            operationMode: 'Test',
            merchantInfo: {
                merchantID: merchantId,
                hashKey: hashKey,
                hashIV: hashIv,
            },
            ignorePayment: [],
            isProjectContractor: 'N',
        };

        const create = new ECPayPayment(options);

        const TradeNo = 'SM' + new Date().getTime();

        // 格式: yyyy/MM/dd HH:mm:ss
        const now = new Date();
        const pad = (n: number) => (n < 10 ? '0' + n : n);
        const TradeDate = `${now.getFullYear()}/${pad(now.getMonth() + 1)}/${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let itemName: string = orderData.items?.map((i: any) => `${i.name} x ${i.quantity}`).join('#') || 'Smart Market Products';
        if (itemName.length > 200) {
            itemName = itemName.substring(0, 195) + '...';
        }

        const apiBase = this.configService.get<string>('ECPAY_API_BASE', 'http://localhost:8080');
        const frontendBase = this.configService.get<string>('FRONTEND_URL', 'http://localhost:3000');

        const parameters = {
            MerchantID: merchantId,
            MerchantTradeNo: TradeNo,
            MerchantTradeDate: TradeDate,
            TotalAmount: Math.round(orderData.amount || 0).toString(),
            TradeDesc: 'Smart Market Order',
            ItemName: itemName,
            ReturnURL: `${apiBase}/ecpay/return`,
            ChoosePayment: 'ALL',
            EncryptType: '1',
            ClientBackURL: `${frontendBase}/order_completed`,
            OrderResultURL: `${apiBase}/ecpay/result`,
        };

        return create.payment_client.aio_check_out_all(parameters);
    }
}
