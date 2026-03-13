import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ChatService } from './chat.service';
import { MessageType } from './entities/message.entity';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations/:matchId')
  async getConversation(
    @CurrentUser() user: User,
    @Param('matchId') matchId: string,
  ) {
    return this.chatService.getConversationForMatch(matchId, user.id);
  }

  @Get('conversations/:matchId/messages')
  async getMessages(
    @CurrentUser() user: User,
    @Param('matchId') matchId: string,
  ) {
    const conv = await this.chatService.getOrCreateConversation(matchId);
    return this.chatService.getMessages(conv.id);
  }

  @Post('conversations/:matchId/messages')
  async sendMessage(
    @CurrentUser() user: User,
    @Param('matchId') matchId: string,
    @Body() body: { content: string; type?: MessageType },
  ) {
    const conv = await this.chatService.getOrCreateConversation(matchId);
    return this.chatService.sendMessage(
      conv.id,
      user.id,
      body.content,
      body.type || MessageType.TEXT,
    );
  }
}
