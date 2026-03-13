import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Swipe } from './entities/swipe.entity';
import { Match } from './entities/match.entity';
import { ChemistryScore } from './entities/chemistry-score.entity';
import { CompatibilityHistory } from './entities/compatibility-history.entity';
import { User } from '../users/entities/user.entity';
import { MatchingController } from './matching.controller';
import { MatchingService } from './matching.service';
import { EnginesModule } from '../engines/engines.module';
import { ProfilesModule } from '../profiles/profiles.module';
import { SafeSpaceModule } from '../safe-space/safe-space.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Swipe, Match, ChemistryScore, CompatibilityHistory, User]),
    EnginesModule,
    ProfilesModule,
    SafeSpaceModule,
  ],
  controllers: [MatchingController],
  providers: [MatchingService],
  exports: [MatchingService],
})
export class MatchingModule {}
