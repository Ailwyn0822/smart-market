import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import type { Request } from 'express';

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) { }

    @UseGuards(JwtAuthGuard)
    @Get('contacts')
    async getContacts(@Req() req: Request) {
        const userId = (req.user as any).sub || (req.user as any).userId;
        return this.chatService.getContacts(userId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('history/:targetId')
    async getHistory(@Param('targetId') targetId: string, @Req() req: Request) {
        const userId = (req.user as any).sub || (req.user as any).userId;
        return this.chatService.getChatHistory(userId, targetId);
    }
}
