import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DatePlan } from './entities/date-plan.entity';
import { VenueSuggestion } from './entities/venue-suggestion.entity';
import { DatePlannerEngine } from '../engines/date-planner/date-planner.engine';
import { VenueRecommendationEngine } from '../engines/venue/venue-recommendation.engine';
import { GooglePlacesService } from './google-places.service';

@Injectable()
export class VenueService {
  constructor(
    @InjectRepository(DatePlan)
    private readonly datePlanRepo: Repository<DatePlan>,
    @InjectRepository(VenueSuggestion)
    private readonly venueSuggestionRepo: Repository<VenueSuggestion>,
    private readonly datePlannerEngine: DatePlannerEngine,
    private readonly venueEngine: VenueRecommendationEngine,
    private readonly googlePlaces: GooglePlacesService,
  ) {}

  async getVenueSuggestions(
    matchId: string,
    midpointLat: number,
    midpointLng: number,
    types: string[] = ['restaurant', 'cafe', 'park'],
  ): Promise<VenueSuggestion[]> {
    const places = await this.googlePlaces.searchNearby(midpointLat, midpointLng, types);
    const suggestions = places.map((p) =>
      this.venueSuggestionRepo.create({
        matchId,
        placeId: p.placeId,
        name: p.name,
        type: p.type,
        rating: p.rating,
        address: p.address,
        latitude: p.latitude,
        longitude: p.longitude,
        distance: p.distance,
        ambienceTags: p.ambienceTags,
      }),
    );
    return this.venueSuggestionRepo.save(suggestions);
  }

  async createDatePlan(
    matchId: string,
    input: {
      sharedInterests: string[];
      ambiencePreference: 'romantic' | 'intellectual' | 'chill' | 'high-energy';
      budgetTier: 'low' | 'mid' | 'high';
    },
  ): Promise<DatePlan> {
    const plan = this.datePlannerEngine.generate({
      ...input,
      durationMinutes: 90,
    });
    return this.datePlanRepo.save({
      matchId,
      title: plan.title,
      description: plan.description,
      durationMinutes: plan.durationMinutes,
      estimatedBudget: plan.estimatedBudget,
      venues: plan.steps.map((s) => ({
        placeId: '',
        name: s.title,
        type: s.type,
      })),
    });
  }
}
