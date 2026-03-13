import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { VideoSession } from './entities/video-session.entity';
import { Match } from '../matching/entities/match.entity';

@Injectable()
export class WebrtcService {
  constructor(
    @InjectRepository(VideoSession)
    private readonly sessionRepo: Repository<VideoSession>,
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,
  ) {}

  async createRoom(matchId: string): Promise<{ roomId: string }> {
    const roomId = uuidv4();
    await this.sessionRepo.save({ matchId, roomId });
    return { roomId };
  }

  async endSession(roomId: string, durationSeconds: number): Promise<void> {
    await this.sessionRepo.update(
      { roomId },
      { durationSeconds },
    );
  }

  async submitFeedback(
    roomId: string,
    userId: string,
    feedback: { energyMatch: number; comfortLevel: number; interestLevel: number },
  ): Promise<void> {
    const session = await this.sessionRepo.findOne({ where: { roomId } });
    if (!session) return;
    const match = await this.matchRepo.findOne({ where: { id: session.matchId } });
    if (!match) return;
    const isUser1 = match.user1Id === userId;
    if (isUser1) {
      await this.sessionRepo.update({ roomId }, { user1Feedback: feedback });
    } else {
      await this.sessionRepo.update({ roomId }, { user2Feedback: feedback });
    }
  }
}
