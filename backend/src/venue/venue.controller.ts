import { Body, Controller, Get, Param, Post, Query, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { VenueService } from './venue.service';

@Controller('venue')
@UseGuards(JwtAuthGuard)
export class VenueController {
  constructor(private readonly venueService: VenueService) {}

  @Get('suggestions/:matchId')
  async getSuggestions(
    @CurrentUser() user: User,
    @Param('matchId') matchId: string,
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    return this.venueService.getVenueSuggestions(
      matchId,
      parseFloat(lat),
      parseFloat(lng),
    );
  }

  @Post('date-plan/:matchId')
  async createDatePlan(
    @CurrentUser() user: User,
    @Param('matchId') matchId: string,
    @Body() body: {
      sharedInterests: string[];
      ambiencePreference: 'romantic' | 'intellectual' | 'chill' | 'high-energy';
      budgetTier: 'low' | 'mid' | 'high';
    },
  ) {
    return this.venueService.createDatePlan(matchId, body);
  }
}
