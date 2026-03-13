import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { WebrtcService } from './webrtc.service';

@Controller('webrtc')
@UseGuards(JwtAuthGuard)
export class WebrtcController {
  constructor(private readonly webrtcService: WebrtcService) {}

  @Post('room/:matchId')
  async createRoom(
    @CurrentUser() user: User,
    @Param('matchId') matchId: string,
  ) {
    return this.webrtcService.createRoom(matchId);
  }

  @Get('ice-servers')
  async getIceServers() {
    return {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        ...(process.env.TURN_SERVER_URL
          ? [
              {
                urls: process.env.TURN_SERVER_URL,
                username: process.env.TURN_USERNAME,
                credential: process.env.TURN_CREDENTIAL,
              },
            ]
          : []),
      ],
    };
  }

  @Post('feedback/:roomId')
  async submitFeedback(
    @CurrentUser() user: User,
    @Param('roomId') roomId: string,
    @Body() body: { energyMatch: number; comfortLevel: number; interestLevel: number },
  ) {
    await this.webrtcService.submitFeedback(roomId, user.id, body);
    return { success: true };
  }
}
