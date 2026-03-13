import { Injectable } from '@nestjs/common';

import { MatchingEngine } from '../matching/matching.engine';
import { Profile } from '../../profiles/entities/profile.entity';
import { PersonalityVector } from '../../profiles/entities/personality-vector.entity';

export interface ChemistryInput {
  profile1: Profile & { personalityVector?: PersonalityVector };
  profile2: Profile & { personalityVector?: PersonalityVector };
  messageCount: number;
  avgResponseTime?: number;
}

export interface ChemistryResult {
  score: number;
  breakdown: Record<string, number>;
  aiInsight: string;
}

@Injectable()
export class ChemistryEngine {
  constructor(private readonly matchingEngine: MatchingEngine) {}

  compute(input: ChemistryInput): ChemistryResult {
    const matchResult = this.matchingEngine.computeScore({
      profile1: input.profile1 as any,
      profile2: input.profile2 as any,
    });

    const personalitySim = matchResult.breakdown.personalitySimilarity ?? 0.5;
    const goalCompat = matchResult.breakdown.relationshipGoal ?? 0.5;
    const githubCompat = matchResult.breakdown.githubDnaSimilarity ?? 0.5;
    const interestOverlap = this.computeInterestOverlap(input.profile1, input.profile2);
    const communicationPacing = this.estimateCommunicationPacing(input.avgResponseTime);
    const humorTone = 0.6; // Placeholder - would need message analysis

    const breakdown: Record<string, number> = {
      personalitySimilarity: personalitySim,
      relationshipGoal: goalCompat,
      githubDnaAlignment: githubCompat,
      lifestyleInterestOverlap: interestOverlap,
      communicationPacing: communicationPacing,
      humorTone: humorTone,
    };

    const weights = [0.2, 0.15, 0.15, 0.2, 0.15, 0.15];
    const values = Object.values(breakdown);
    const score = Math.round(
      values.reduce((acc, v, i) => acc + v * weights[i], 0) * 100,
    );

    const aiInsight = this.generateInsight(breakdown);

    return {
      score: Math.min(100, Math.max(0, score)),
      breakdown,
      aiInsight,
    };
  }

  private computeInterestOverlap(p1: Profile, p2: Profile): number {
    const s1 = new Set((p1.interests || []).map((x) => x.toLowerCase()));
    const s2 = new Set((p2.interests || []).map((x) => x.toLowerCase()));
    if (s1.size === 0 && s2.size === 0) return 0.5;
    const overlap = [...s1].filter((x) => s2.has(x)).length;
    const union = new Set([...s1, ...s2]).size;
    return union === 0 ? 0.5 : overlap / union;
  }

  private estimateCommunicationPacing(avgMs?: number): number {
    if (!avgMs) return 0.6;
    if (avgMs < 60000) return 0.9; // < 1 min - very responsive
    if (avgMs < 300000) return 0.8; // < 5 min
    if (avgMs < 86400000) return 0.7; // < 1 day
    return 0.5;
  }

  private generateInsight(breakdown: Record<string, number>): string {
    const high: string[] = [];
    if ((breakdown.personalitySimilarity ?? 0) > 0.8) high.push('High intellectual synergy');
    if ((breakdown.lifestyleInterestOverlap ?? 0) > 0.7) high.push('Strong lifestyle alignment');
    if ((breakdown.communicationPacing ?? 0) > 0.8) high.push('Complementary temperaments');
    if (high.length > 0) return high.join('. ');
    return 'Building connection - keep the conversation going!';
  }
}
