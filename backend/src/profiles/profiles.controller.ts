import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ProfilesService, UpdateProfileDto } from './profiles.service';
import { MoodState } from './entities/profile.entity';

@Controller('profiles')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get('me')
  async getMyProfile(@CurrentUser() user: User) {
    let profile = await this.profilesService.findByUserId(user.id);
    if (!profile) {
      profile = await this.profilesService.create(user.id);
    }
    return profile;
  }

  @Patch('me')
  async updateMyProfile(@CurrentUser() user: User, @Body() dto: UpdateProfileDto) {
    let profile = await this.profilesService.findByUserId(user.id);
    if (!profile) profile = await this.profilesService.create(user.id);
    return this.profilesService.update(user.id, dto);
  }

  @Patch('me/mood')
  async updateMood(@CurrentUser() user: User, @Body() body: { mood: MoodState }) {
    return this.profilesService.updateMood(user.id, body.mood);
  }

  @Patch('me/ready-to-meet')
  async updateReadyToMeet(@CurrentUser() user: User, @Body() body: { ready: boolean }) {
    return this.profilesService.updateReadyToMeet(user.id, body.ready);
  }
}
