import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { SafeSpaceService } from './safe-space.service';

@Controller('safe-space')
@UseGuards(JwtAuthGuard)
export class SafeSpaceController {
  constructor(private readonly safeSpaceService: SafeSpaceService) {}

  @Post('block')
  async block(@CurrentUser() user: User, @Body() body: { userId: string }) {
    return this.safeSpaceService.block(user.id, body.userId);
  }

  @Delete('block')
  async unblock(@CurrentUser() user: User, @Body() body: { userId: string }) {
    await this.safeSpaceService.unblock(user.id, body.userId);
  }

  @Post('report')
  async report(
    @CurrentUser() user: User,
    @Body() body: { userId: string; reason: string; details?: string; messageId?: string },
  ) {
    return this.safeSpaceService.report(
      user.id,
      body.userId,
      body.reason,
      body.details,
      body.messageId,
    );
  }
}
