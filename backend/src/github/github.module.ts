import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { GithubDna } from '../profiles/entities/github-dna.entity';
import { GithubController } from './github.controller';
import { GithubService } from './github.service';
import { ProfilesModule } from '../profiles/profiles.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GithubDna]),
    ProfilesModule,
  ],
  controllers: [GithubController],
  providers: [GithubService],
  exports: [GithubService],
})
export class GithubModule {}
