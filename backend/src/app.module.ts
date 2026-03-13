import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProfilesModule } from './profiles/profiles.module';
import { MatchingModule } from './matching/matching.module';
import { ChatModule } from './chat/chat.module';
import { GithubModule } from './github/github.module';
import { WebrtcModule } from './webrtc/webrtc.module';
import { VenueModule } from './venue/venue.module';
import { SafeSpaceModule } from './safe-space/safe-space.module';
import { EnginesModule } from './engines/engines.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV === 'development',
      logging: process.env.NODE_ENV === 'development',
    }),
    AuthModule,
    UsersModule,
    ProfilesModule,
    MatchingModule,
    ChatModule,
    GithubModule,
    WebrtcModule,
    VenueModule,
    SafeSpaceModule,
    EnginesModule,
  ],
})
export class AppModule {}
