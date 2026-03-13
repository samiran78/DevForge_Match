import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { Conversation } from './entities/conversation.entity';
import { Message } from './entities/message.entity';
import { FlirtInteraction } from './entities/flirt-interaction.entity';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MatchingModule } from '../matching/matching.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Conversation, Message, FlirtInteraction]),
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev-secret',
      signOptions: { expiresIn: '15m' },
    }),
    MatchingModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatGateway],
  exports: [ChatService],
})
export class ChatModule {}
