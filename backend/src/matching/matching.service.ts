import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Swipe } from './entities/swipe.entity';
import { Match } from './entities/match.entity';
import { ChemistryScore } from './entities/chemistry-score.entity';
import { User } from '../users/entities/user.entity';
import { MatchingEngine } from '../engines/matching/matching.engine';
import { ChemistryEngine } from '../engines/chemistry/chemistry.engine';
import { ProfilesService } from '../profiles/profiles.service';
import { SafeSpaceService } from '../safe-space/safe-space.service';

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(Swipe)
    private readonly swipeRepo: Repository<Swipe>,
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,
    @InjectRepository(ChemistryScore)
    private readonly chemistryRepo: Repository<ChemistryScore>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
    private readonly matchingEngine: MatchingEngine,
    private readonly chemistryEngine: ChemistryEngine,
    private readonly profilesService: ProfilesService,
    private readonly safeSpaceService: SafeSpaceService,
  ) {}

  async swipe(swiperId: string, swipedId: string, direction: boolean): Promise<{ match?: Match }> {
    await this.safeSpaceService.ensureNotBlocked(swiperId, swipedId);

    const existing = await this.swipeRepo.findOne({
      where: { swiperId, swipedId },
    });
    if (existing) return {}; // Already swiped

    await this.swipeRepo.save({
      swiperId,
      swipedId,
      direction,
    });

    if (!direction) return {}; // Left swipe - no match

    const mutual = await this.swipeRepo.findOne({
      where: { swiperId: swipedId, swipedId: swiperId, direction: true },
    });
    if (!mutual) return {}; // No mutual like

    const match = await this.createMatch(swiperId, swipedId);
    return { match };
  }

  private async createMatch(user1Id: string, user2Id: string): Promise<Match> {
    const [p1, p2] = await Promise.all([
      this.profilesService.findByUserId(user1Id),
      this.profilesService.findByUserId(user2Id),
    ]);
    const scoreResult = this.matchingEngine.computeScore({
      profile1: p1 as any,
      profile2: p2 as any,
    });

    const match = await this.matchRepo.save({
      user1Id,
      user2Id,
      baseScore: scoreResult.score,
    });
    return match;
  }

  async getMatches(userId: string): Promise<Match[]> {
    return this.matchRepo
      .createQueryBuilder('m')
      .where('m.user1Id = :id OR m.user2Id = :id', { id: userId })
      .leftJoinAndSelect('m.user1', 'user1')
      .leftJoinAndSelect('m.user2', 'user2')
      .leftJoinAndSelect('user1.profile', 'p1')
      .leftJoinAndSelect('user2.profile', 'p2')
      .orderBy('m.createdAt', 'DESC')
      .getMany();
  }

  async getCandidates(userId: string, limit = 20): Promise<any[]> {
    const blocked = await this.safeSpaceService.getBlockedUserIds(userId);
    const swiped = await this.swipeRepo
      .createQueryBuilder('s')
      .select('s.swipedId')
      .where('s.swiperId = :id', { id: userId })
      .getRawMany();
    const swipedIds = swiped.map((r) => r.swipedId);
    const exclude = new Set([userId, ...blocked, ...swipedIds]);
    const excludeArr = [...exclude];

    const users = await this.userRepo
      .createQueryBuilder('u')
      .leftJoinAndSelect('u.profile', 'p')
      .leftJoinAndSelect('p.githubDna', 'gd')
      .where('u.id NOT IN (:...exclude)', { exclude: excludeArr })
      .andWhere('u.isActive = :active', { active: true })
      .andWhere('u.profileComplete = :complete', { complete: true })
      .orderBy('RANDOM()')
      .take(limit)
      .getMany();

    return users.map((u) => ({
      id: u.id,
      email: u.email,
      avatarUrl: u.avatarUrl,
      profile: u.profile,
    }));
  }

  async computeAndStoreChemistry(matchId: string): Promise<ChemistryScore> {
    const match = await this.matchRepo.findOne({
      where: { id: matchId },
      relations: ['user1', 'user2'],
    });
    if (!match) throw new Error('Match not found');

    const [p1, p2] = await Promise.all([
      this.profilesService.findByUserId(match.user1Id),
      this.profilesService.findByUserId(match.user2Id),
    ]);
    const result = this.chemistryEngine.compute({
      profile1: p1 as any,
      profile2: p2 as any,
      messageCount: match.messageCount,
    });

    const chemistry = await this.chemistryRepo.save({
      matchId,
      score: result.score,
      breakdown: result.breakdown,
      aiInsight: result.aiInsight,
    });
    await this.matchRepo.update(matchId, { chemistryRevealed: true });
    return chemistry;
  }

  async incrementMessageCount(matchId: string): Promise<void> {
    await this.matchRepo.increment({ id: matchId }, 'messageCount', 1);
  }
}
