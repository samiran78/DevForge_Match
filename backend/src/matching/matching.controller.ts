import { Body, Controller, Get, Param, Post, Query, UseGuards, ForbiddenException } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { MatchingService } from './matching.service';

@Controller('matching')
@UseGuards(JwtAuthGuard)
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post('swipe')
  async swipe(
    @CurrentUser() user: User,
    @Body() body: { userId: string; direction: boolean },
  ) {
    return this.matchingService.swipe(user.id, body.userId, body.direction);
  }

  @Get('candidates')
  async getCandidates(
    @CurrentUser() user: User,
    @Query('limit') limit?: string,
  ) {
    return this.matchingService.getCandidates(user.id, limit ? parseInt(limit, 10) : 20);
  }

  @Get('matches')
  async getMatches(@CurrentUser() user: User) {
    return this.matchingService.getMatches(user.id);
  }

  @Post('matches/:matchId/chemistry')
  async computeChemistry(
    @CurrentUser() user: User,
    @Param('matchId') matchId: string,
  ) {
    const matches = await this.matchingService.getMatches(user.id);
    const found = matches.find((m) => m.id === matchId);
    if (!found) throw new ForbiddenException('Match not found');
    return this.matchingService.computeAndStoreChemistry(matchId);
  }
}
