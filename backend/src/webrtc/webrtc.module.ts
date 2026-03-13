import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VideoSession } from './entities/video-session.entity';
import { Match } from '../matching/entities/match.entity';
import { WebrtcController } from './webrtc.controller';
import { WebrtcService } from './webrtc.service';

@Module({
  imports: [TypeOrmModule.forFeature([VideoSession, Match])],
  controllers: [WebrtcController],
  providers: [WebrtcService],
  exports: [WebrtcService],
})
export class WebrtcModule {}
