import { Module } from '@nestjs/common';

import { MatchingEngine } from './matching/matching.engine';
import { LlmService } from './personality/llm.service';
import { ChemistryEngine } from './chemistry/chemistry.engine';
import { PersonalityEngine } from './personality/personality.engine';
import { DatePlannerEngine } from './date-planner/date-planner.engine';
import { VenueRecommendationEngine } from './venue/venue-recommendation.engine';
import { MoodEngine } from './mood/mood.engine';

@Module({
  providers: [
    LlmService,
    MatchingEngine,
    ChemistryEngine,
    PersonalityEngine,
    DatePlannerEngine,
    VenueRecommendationEngine,
    MoodEngine,
  ],
  exports: [
    MatchingEngine,
    ChemistryEngine,
    PersonalityEngine,
    DatePlannerEngine,
    VenueRecommendationEngine,
    MoodEngine,
  ],
})
export class EnginesModule {}
