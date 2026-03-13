import { Injectable } from '@nestjs/common';
import { MoodState } from '../../profiles/entities/profile.entity';

@Injectable()
export class MoodEngine {
  getComplementaryMoods(mood: MoodState): MoodState[] {
    const complementMap: Record<MoodState, MoodState[]> = {
      [MoodState.FOCUSED]: [MoodState.PLAYFUL, MoodState.DEEP_TALK],
      [MoodState.PLAYFUL]: [MoodState.ADVENTUROUS, MoodState.ROMANTIC],
      [MoodState.ROMANTIC]: [MoodState.PLAYFUL, MoodState.DEEP_TALK],
      [MoodState.ADVENTUROUS]: [MoodState.PLAYFUL, MoodState.FOCUSED],
      [MoodState.LOW_ENERGY]: [MoodState.DEEP_TALK, MoodState.PLAYFUL],
      [MoodState.DEEP_TALK]: [MoodState.ROMANTIC, MoodState.FOCUSED],
    };
    return complementMap[mood] || [MoodState.PLAYFUL, MoodState.DEEP_TALK];
  }

  getMoodBoost(mood: MoodState, targetMood?: MoodState): number {
    if (!targetMood) return 1;
    const complementary = this.getComplementaryMoods(mood);
    return complementary.includes(targetMood) ? 1.2 : 1;
  }
}
