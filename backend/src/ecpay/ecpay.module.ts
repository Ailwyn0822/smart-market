import { Module } from '@nestjs/common';
import { EcpayController } from './ecpay.controller';
import { EcpayService } from './ecpay.service';
import { OrdersModule } from '../orders/orders.module';

@Module({
    imports: [OrdersModule],
    controllers: [EcpayController],
    providers: [EcpayService],
    exports: [EcpayService]
})
export class EcpayModule { }
