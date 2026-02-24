import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    Req,
    UseGuards,
    Patch,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    createOrder(@Body() dto: CreateOrderDto, @Req() req: any) {
        const userId: string = req.user.sub || req.user.id || req.user.userId;
        return this.ordersService.createOrder(userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('my')
    getMyOrders(@Req() req: any) {
        const userId: string = req.user.sub || req.user.id || req.user.userId;
        return this.ordersService.getMyOrders(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('selling')
    getSellingOrders(@Req() req: any) {
        const userId: string = req.user.sub || req.user.id || req.user.userId;
        return this.ordersService.getSellingOrders(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch(':id/status')
    updateOrderStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: string,
        @Req() req: any
    ) {
        const userId: string = req.user.sub || req.user.id || req.user.userId;
        return this.ordersService.updateOrderStatus(userId, id, status);
    }

    @UseGuards(JwtAuthGuard)
    @Get('seller/dashboard')
    getSellerDashboard(@Req() req: any) {
        const userId: string = req.user.sub || req.user.id || req.user.userId;
        return this.ordersService.getSellerDashboard(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    getOrderById(@Param('id', ParseIntPipe) id: number, @Req() req: any) {
        const userId: string = req.user.sub || req.user.id || req.user.userId;
        return this.ordersService.getOrderById(userId, id);
    }

    // 清空所有訂單（開發/測試用）
    @Delete('clear-all')
    clearAllOrders() {
        return this.ordersService.clearAll();
    }
}
