import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL || '*' },
  namespace: '/chat',
})
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, Set<string>>();

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: any) {
    const token = client.handshake?.auth?.token || client.handshake?.headers?.authorization?.replace('Bearer ', '');
    if (!token) {
      client.disconnect();
      return;
    }
    try {
      const payload = this.jwtService.verify(token);
      const userId = payload.sub;
      if (!this.userSockets.has(userId)) this.userSockets.set(userId, new Set());
      this.userSockets.get(userId)!.add(client.id);
      client.userId = userId;
    } catch {
      client.disconnect();
    }
  }

  handleDisconnect(client: any) {
    const userId = client.userId;
    if (userId && this.userSockets.has(userId)) {
      this.userSockets.get(userId)!.delete(client.id);
      if (this.userSockets.get(userId)!.size === 0) this.userSockets.delete(userId);
    }
  }

  @SubscribeMessage('join_conversation')
  handleJoin(client: any, payload: { matchId: string }) {
    client.join(`match:${payload.matchId}`);
  }

  @SubscribeMessage('typing')
  handleTyping(client: any, payload: { matchId: string }) {
    client.to(`match:${payload.matchId}`).emit('user_typing', { userId: client.userId });
  }

  @SubscribeMessage('message')
  handleMessage(client: any, payload: { matchId: string; content: string }) {
    this.server.to(`match:${payload.matchId}`).emit('new_message', {
      senderId: client.userId,
      content: payload.content,
      createdAt: new Date(),
    });
  }

  emitNewMessage(matchId: string, message: any) {
    this.server.to(`match:${matchId}`).emit('new_message', message);
  }
}
