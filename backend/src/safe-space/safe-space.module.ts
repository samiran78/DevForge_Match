import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Block } from './entities/block.entity';
import { Report } from './entities/report.entity';
import { SafeSpaceController } from './safe-space.controller';
import { SafeSpaceService } from './safe-space.service';

@Module({
  imports: [TypeOrmModule.forFeature([Block, Report])],
  controllers: [SafeSpaceController],
  providers: [SafeSpaceService],
  exports: [SafeSpaceService],
})
export class SafeSpaceModule {}
