import { WebSocketGateway, SubscribeMessage, MessageBody, ConnectedSocket, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';

@WebSocketGateway({
    cors: { origin: '*' },
    namespace: '/chat'
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()
    server: Server;

    // Map user UUID to their socket ID set to support multiple devices
    private userSockets = new Map<string, Set<string>>();

    constructor(private readonly chatService: ChatService) { }

    handleConnection(client: Socket) {
        const userId = client.handshake.query.userId as string;
        if (userId) {
            if (!this.userSockets.has(userId)) {
                this.userSockets.set(userId, new Set());
            }
            this.userSockets.get(userId)?.add(client.id);

            // Also join a room for exactly this user ID to broadcast directly
            client.join(userId);
            console.log(`User ${userId} connected with socket ${client.id}`);
        }
    }

    handleDisconnect(client: Socket) {
        const userId = client.handshake.query.userId as string;
        if (userId && this.userSockets.has(userId)) {
            this.userSockets.get(userId)?.delete(client.id);
            if (this.userSockets.get(userId)?.size === 0) {
                this.userSockets.delete(userId);
            }
            console.log(`User ${userId} disconnected from socket ${client.id}`);
        }
    }

    @SubscribeMessage('sendMessage')
    async handleMessage(
        @ConnectedSocket() client: Socket,
        @MessageBody() payload: { receiverId: string; content: string }
    ) {
        const senderId = client.handshake.query.userId as string;
        if (!senderId) return { status: 'error', message: 'No senderId connected' };

        // Save to DB
        const message = await this.chatService.saveMessage(senderId, payload.receiverId, payload.content);

        // Broadcast to the receiver
        this.server.to(payload.receiverId).emit('newMessage', message);

        // Send back to all sender's other sockets (if any) and to the current one
        this.server.to(senderId).emit('newMessage', message);

        return { status: 'success', data: message };
    }
}
