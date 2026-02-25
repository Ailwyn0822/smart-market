import {
    Controller,
    Post,
    Get,
    Delete,
    Body,
    Param,
    ParseIntPipe,
    Query,
    Req,
    UseGuards,
    Patch,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@ApiTags('orders')
@ApiBearerAuth('JWT-auth')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @UseGuards(JwtAuthGuard)
    @Post()
    @ApiOperation({ summary: '建立訂單' })
    @ApiResponse({ status: 201, description: '訂單建立成功' })
    createOrder(@Body() dto: CreateOrderDto, @Req() req: any) {
        const userId: string = req.user.sub || req.user.id || req.user.userId;
        return this.ordersService.createOrder(userId, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('my')
    @ApiOperation({ summary: '我的購買訂單' })
    @ApiResponse({ status: 200, description: '訂單清單' })
    getMyOrders(@Req() req: any) {
        const userId: string = req.user.sub || req.user.id || req.user.userId;
        return this.ordersService.getMyOrders(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('selling')
    @ApiOperation({ summary: '我的銷售訂單' })
    @ApiResponse({ status: 200, description: '銷售訂單清單' })
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
    @ApiOperation({ summary: '賣家儀表板統計' })
    @ApiResponse({ status: 200, description: '销售統計資料' })
    getSellerDashboard(@Req() req: any) {
        const userId: string = req.user.sub || req.user.id || req.user.userId;
        return this.ordersService.getSellerDashboard(userId);
    }

    // ── Admin 端點（必須在 :id 動態路由之前）──────────────────
    @UseGuards(JwtAuthGuard)
    @Get('admin/all')
    @ApiOperation({ summary: 'Admin 取得所有訂單（分頁）' })
    @ApiResponse({ status: 200, description: '訂單列表' })
    adminGetAllOrders(
        @Query('page') page = '1',
        @Query('limit') limit = '20',
        @Query('keyword') keyword?: string,
        @Query('status') status?: string,
    ) {
        return this.ordersService.getAllOrders(
            parseInt(page, 10),
            parseInt(limit, 10),
            keyword,
            status,
        );
    }

    @UseGuards(JwtAuthGuard)
    @Patch('admin/:id/status')
    @ApiOperation({ summary: 'Admin 更新任意訂單狀態' })
    @ApiResponse({ status: 200, description: '更新成功' })
    adminUpdateStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body('status') status: string,
    ) {
        return this.ordersService.adminUpdateStatus(id, status);
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
