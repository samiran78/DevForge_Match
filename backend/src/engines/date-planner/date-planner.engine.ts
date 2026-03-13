import { Injectable } from '@nestjs/common';

export interface MicroDateInput {
  sharedInterests: string[];
  ambiencePreference: 'romantic' | 'intellectual' | 'chill' | 'high-energy';
  budgetTier: 'low' | 'mid' | 'high';
  durationMinutes: number;
}

export interface MicroDatePlan {
  title: string;
  description: string;
  durationMinutes: number;
  estimatedBudget?: number;
  steps: Array<{ title: string; duration: number; type: string }>;
}

@Injectable()
export class DatePlannerEngine {
  private readonly TEMPLATES: Record<string, MicroDatePlan> = {
    'code-and-coffee': {
      title: 'Code & Coffee',
      description: '45 min café session followed by a short park walk',
      durationMinutes: 75,
      estimatedBudget: 25,
      steps: [
        { title: 'Coffee & conversation', duration: 45, type: 'cafe' },
        { title: 'Park walk', duration: 30, type: 'park' },
      ],
    },
    'debug-and-dinner': {
      title: 'Debug & Dinner',
      description: 'Casual bistro with post-meal live coding challenge',
      durationMinutes: 120,
      estimatedBudget: 60,
      steps: [
        { title: 'Casual bistro dinner', duration: 60, type: 'restaurant' },
        { title: 'Fun live coding challenge', duration: 60, type: 'activity' },
      ],
    },
    'pitch-and-paint': {
      title: 'Pitch & Paint',
      description: 'Art café with 3-question future vision game',
      durationMinutes: 90,
      estimatedBudget: 45,
      steps: [
        { title: 'Art café', duration: 60, type: 'cafe' },
        { title: 'Future vision game', duration: 30, type: 'activity' },
      ],
    },
  };

  generate(input: MicroDateInput): MicroDatePlan {
    const templateKey = this.selectTemplate(input);
    const template = this.TEMPLATES[templateKey] || this.TEMPLATES['code-and-coffee'];
    const budget = this.adjustBudget(template.estimatedBudget || 0, input.budgetTier);
    return {
      ...template,
      estimatedBudget: budget,
      durationMinutes: input.durationMinutes || template.durationMinutes,
    };
  }

  private selectTemplate(input: MicroDateInput): string {
    if (input.ambiencePreference === 'chill') return 'code-and-coffee';
    if (input.ambiencePreference === 'intellectual') return 'pitch-and-paint';
    if (input.ambiencePreference === 'high-energy') return 'debug-and-dinner';
    return 'code-and-coffee';
  }

  private adjustBudget(base: number, tier: string): number {
    const mult = { low: 0.7, mid: 1, high: 1.5 }[tier] || 1;
    return Math.round(base * mult);
  }
}
