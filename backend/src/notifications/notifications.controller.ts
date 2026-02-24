import { Controller, Get, Req, UseGuards, Sse, MessageEvent, Patch } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';
import { Observable, fromEvent, map } from 'rxjs';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Controller('notifications')
export class NotificationsController {
    constructor(
        private readonly notificationsService: NotificationsService,
        private eventEmitter: EventEmitter2
    ) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    async getHistory(@Req() req: Request) {
        const userId = (req.user as any).sub || (req.user as any).userId;
        return this.notificationsService.getNotifications(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('read')
    async markAsRead(@Req() req: Request) {
        const userId = (req.user as any).sub || (req.user as any).userId;
        return this.notificationsService.markAllAsRead(userId);
    }

    // SSE Endpoint
    // 注意：SSE 原生不支援 headers 放 Bearer Token，通常會改用 URL Query ?token=xxx 進行 AuthGuard，
    // 這裡我們簡化處理，透過 Query 拿到 token，但不強制掛 JwtAuthGuard 以免阻擋 EventSource。
    // (推薦更嚴謹的做法是在這額外加個可以讀 query token 的 Guard)
    @Sse('stream')
    stream(@Req() req: Request): Observable<MessageEvent> {
        // 簡單解析 query 帶進來的 userId，實務上請做 token 解碼驗證
        const rawUserId = req.query.userId as string;

        // 將 EventEmitter 的特定 event 變成 RxJs Observable 回傳
        return fromEvent(this.eventEmitter, `notification.${rawUserId}`).pipe(
            map((data: any) => ({
                data
            } as MessageEvent))
        );
    }
}
