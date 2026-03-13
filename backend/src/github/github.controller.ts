import { Body, Controller, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { GithubService } from './github.service';
import { ProfilesService } from '../profiles/profiles.service';

@Controller('github')
@UseGuards(JwtAuthGuard)
export class GithubController {
  constructor(
    private readonly githubService: GithubService,
    private readonly profilesService: ProfilesService,
  ) {}

  @Post('analyze')
  async analyze(@CurrentUser() user: User, @Body() body: { username?: string }) {
    const username = body.username || user.githubUsername;
    if (!username) throw new Error('No GitHub username');
    const profile = await this.profilesService.findByUserId(user.id);
    if (!profile) throw new Error('Profile not found');
    return this.githubService.analyzeAndStore(profile.id, username);
  }
}
