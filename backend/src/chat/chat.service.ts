import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { MessageType } from './entities/message.entity';
import { MatchingService } from '../matching/matching.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Conversation)
    private readonly convRepo: Repository<Conversation>,
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
    private readonly matchingService: MatchingService,
  ) {}

  async getOrCreateConversation(matchId: string): Promise<Conversation> {
    let conv = await this.convRepo.findOne({ where: { matchId } });
    if (!conv) {
      conv = await this.convRepo.save({ matchId });
    }
    return conv;
  }

  async getConversationForMatch(matchId: string, userId: string): Promise<Conversation | null> {
    const conv = await this.convRepo.findOne({
      where: { matchId },
      relations: ['match', 'messages', 'messages.sender'],
    });
    if (!conv?.match) return null;
    const { user1Id, user2Id } = conv.match as any;
    if (userId !== user1Id && userId !== user2Id) return null;
    return conv;
  }

  async sendMessage(
    conversationId: string,
    senderId: string,
    content: string,
    type: MessageType = MessageType.TEXT,
  ): Promise<Message> {
    const conv = await this.convRepo.findOne({ where: { id: conversationId }, relations: ['match'] });
    if (conv?.match) {
      const m = conv.match as any;
      if (m.user1Id !== senderId && m.user2Id !== senderId) throw new Error('Not part of this match');
    }
    const msg = await this.messageRepo.save({
      conversationId,
      senderId,
      content,
      type,
    });
    if (conv) {
      await this.convRepo.update(conversationId, { lastMessageAt: new Date() });
      await this.matchingService.incrementMessageCount(conv.matchId);
    }
    return msg;
  }

  async getMessages(conversationId: string, limit = 50): Promise<Message[]> {
    return this.messageRepo.find({
      where: { conversationId },
      relations: ['sender'],
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }
}
