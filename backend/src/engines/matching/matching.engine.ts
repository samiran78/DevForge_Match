import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Profile } from '../../profiles/entities/profile.entity';
import { GithubDna, AuraType } from '../../profiles/entities/github-dna.entity';
import { PersonalityVector } from '../../profiles/entities/personality-vector.entity';

export interface MatchScoreInput {
  profile1: Profile & { githubDna?: GithubDna; personalityVector?: PersonalityVector };
  profile2: Profile & { githubDna?: GithubDna; personalityVector?: PersonalityVector };
}

export interface MatchScoreResult {
  score: number;
  breakdown: Record<string, number>;
}

@Injectable()
export class MatchingEngine {
  private readonly WEIGHTS = {
    skillOverlap: 0.25,
    experienceCompatibility: 0.2,
    relationshipGoal: 0.2,
    githubDnaSimilarity: 0.2,
    personalitySimilarity: 0.15,
  };

  computeScore(input: MatchScoreInput): MatchScoreResult {
    const breakdown: Record<string, number> = {};

    breakdown.skillOverlap = this.computeSkillOverlap(input.profile1, input.profile2);
    breakdown.experienceCompatibility = this.computeExperienceCompatibility(
      input.profile1.experienceLevel,
      input.profile2.experienceLevel,
    );
    breakdown.relationshipGoal = input.profile1.relationshipGoal === input.profile2.relationshipGoal ? 1 : 0.3;
    breakdown.githubDnaSimilarity = this.computeGithubDnaSimilarity(
      input.profile1.githubDna,
      input.profile2.githubDna,
    );
    breakdown.personalitySimilarity = this.computePersonalitySimilarity(
      input.profile1.personalityVector,
      input.profile2.personalityVector,
    );

    const score =
      breakdown.skillOverlap * this.WEIGHTS.skillOverlap +
      breakdown.experienceCompatibility * this.WEIGHTS.experienceCompatibility +
      breakdown.relationshipGoal * this.WEIGHTS.relationshipGoal +
      breakdown.githubDnaSimilarity * this.WEIGHTS.githubDnaSimilarity +
      breakdown.personalitySimilarity * this.WEIGHTS.personalitySimilarity;

    return {
      score: Math.round(score * 100) / 100,
      breakdown,
    };
  }

  private computeSkillOverlap(p1: Profile, p2: Profile): number {
    const s1 = new Set(p1.techStack || []);
    const s2 = new Set(p2.techStack || []);
    if (s1.size === 0 && s2.size === 0) return 0.5;
    const overlap = [...s1].filter((x) => s2.has(x)).length;
    const union = new Set([...s1, ...s2]).size;
    return union === 0 ? 0.5 : overlap / union;
  }

  private computeExperienceCompatibility(level1: string, level2: string): number {
    const order = ['junior', 'mid', 'senior', 'staff', 'principal'];
    const i1 = order.indexOf(level1);
    const i2 = order.indexOf(level2);
    const diff = Math.abs(i1 - i2);
    return Math.max(0, 1 - diff * 0.25);
  }

  private computeGithubDnaSimilarity(dna1?: GithubDna, dna2?: GithubDna): number {
    if (!dna1 || !dna2) return 0.5;
    if (dna1.auraType === dna2.auraType) return 1;
    const complementary = [
      [AuraType.GREEN, AuraType.GOLD],
      [AuraType.BLUE, AuraType.PURPLE],
      [AuraType.RED, AuraType.PURPLE],
    ];
    const pair = [dna1.auraType, dna2.auraType].sort();
    const isComplementary = complementary.some(
      ([a, b]) => (a === pair[0] && b === pair[1]) || (b === pair[0] && a === pair[1]),
    );
    return isComplementary ? 0.8 : 0.5;
  }

  private computePersonalitySimilarity(pv1?: PersonalityVector, pv2?: PersonalityVector): number {
    if (!pv1?.vector || !pv2?.vector) return 0.5;
    const keys = new Set([...Object.keys(pv1.vector), ...Object.keys(pv2.vector)]);
    let dot = 0,
      norm1 = 0,
      norm2 = 0;
    for (const k of keys) {
      const v1 = pv1.vector[k] ?? 0;
      const v2 = pv2.vector[k] ?? 0;
      dot += v1 * v2;
      norm1 += v1 * v1;
      norm2 += v2 * v2;
    }
    const denom = Math.sqrt(norm1) * Math.sqrt(norm2);
    return denom === 0 ? 0.5 : Math.max(0, Math.min(1, dot / denom));
  }
}
