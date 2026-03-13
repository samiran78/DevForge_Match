import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DatePlan } from './entities/date-plan.entity';
import { VenueSuggestion } from './entities/venue-suggestion.entity';
import { SponsoredVenue } from './entities/sponsored-venue.entity';
import { VenueController } from './venue.controller';
import { VenueService } from './venue.service';
import { GooglePlacesService } from './google-places.service';
import { EnginesModule } from '../engines/engines.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DatePlan, VenueSuggestion, SponsoredVenue]),
    EnginesModule,
  ],
  controllers: [VenueController],
  providers: [VenueService, GooglePlacesService],
  exports: [VenueService],
})
export class VenueModule {}
