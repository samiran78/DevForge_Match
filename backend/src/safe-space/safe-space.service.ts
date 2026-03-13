import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Block } from './entities/block.entity';
import { Report } from './entities/report.entity';
import { ReportStatus } from './entities/report.entity';

@Injectable()
export class SafeSpaceService {
  constructor(
    @InjectRepository(Block)
    private readonly blockRepo: Repository<Block>,
    @InjectRepository(Report)
    private readonly reportRepo: Repository<Report>,
  ) {}

  async block(blockerId: string, blockedId: string): Promise<Block> {
    const existing = await this.blockRepo.findOne({
      where: { blockerId, blockedId },
    });
    if (existing) return existing;
    return this.blockRepo.save({ blockerId, blockedId });
  }

  async unblock(blockerId: string, blockedId: string): Promise<void> {
    await this.blockRepo.delete({ blockerId, blockedId });
  }

  async getBlockedUserIds(userId: string): Promise<string[]> {
    const blocks = await this.blockRepo.find({
      where: { blockerId: userId },
      select: ['blockedId'],
    });
    return blocks.map((b) => b.blockedId);
  }

  async ensureNotBlocked(userId: string, targetId: string): Promise<void> {
    const blocked = await this.blockRepo.findOne({
      where: [
        { blockerId: userId, blockedId: targetId },
        { blockerId: targetId, blockedId: userId },
      ],
    });
    if (blocked) throw new Error('User is blocked');
  }

  async report(
    reporterId: string,
    reportedId: string,
    reason: string,
    details?: string,
    relatedMessageId?: string,
  ): Promise<Report> {
    return this.reportRepo.save({
      reporterId,
      reportedId,
      reason,
      details,
      relatedMessageId,
      status: ReportStatus.PENDING,
    });
  }
}
