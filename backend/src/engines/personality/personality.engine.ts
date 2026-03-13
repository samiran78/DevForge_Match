import { Injectable } from '@nestjs/common';

export interface PersonalityInferenceInput {
  bio?: string;
  githubReadmeTone?: string;
  techStack: string[];
  relationshipGoal: string;
}

export interface PersonalityInferenceResult {
  vector: Record<string, number>;
  romanticInclination: string;
  conversationStarters: string[];
}

@Injectable()
export class PersonalityEngine {
  async infer(input: PersonalityInferenceInput): Promise<PersonalityInferenceResult> {
    // In production, call LLM API (OpenAI/Anthropic)
    // For now, heuristic-based inference
    const vector: Record<string, number> = {
      analytical: 0.5,
      creative: 0.5,
      collaborative: 0.5,
      independent: 0.5,
      adventurous: 0.5,
      pragmatic: 0.5,
    };

    if (input.bio) {
      const bio = input.bio.toLowerCase();
      if (bio.includes('startup') || bio.includes('build')) vector.entrepreneurial = 0.8;
      if (bio.includes('open source') || bio.includes('oss')) vector.collaborative = 0.9;
      if (bio.includes('algorithm') || bio.includes('system')) vector.analytical = 0.9;
    }

    if (input.techStack?.length) {
      const fullstack = ['react', 'node', 'python', 'typescript'].filter((t) =>
        input.techStack.some((s) => s.toLowerCase().includes(t)),
      );
      if (fullstack.length >= 2) vector.pragmatic = 0.8;
    }

    const romanticInclination = this.mapGoalToRomantic(input.relationshipGoal);
    const conversationStarters = this.generateStarters(input);

    return {
      vector: Object.fromEntries(
        Object.entries(vector).map(([k, v]) => [k, Math.round(v * 100) / 100]),
      ),
      romanticInclination,
      conversationStarters,
    };
  }

  private mapGoalToRomantic(goal: string): string {
    const map: Record<string, string> = {
      lts: 'Looking for long-term partnership',
      beta_testing: 'Exploring compatibility',
      serverless: 'Flexible and adaptive',
      open_source: 'Community-oriented connection',
      peer_review: 'Collaborative growth',
    };
    return map[goal] || 'Open to connection';
  }

  private generateStarters(input: PersonalityInferenceInput): string[] {
    const starters: string[] = [];
    if (input.techStack?.length) {
      starters.push(`What's your favorite ${input.techStack[0]} project?`);
    }
    starters.push('Build a startup together in 24 hours or cook dinner?');
    starters.push('Backend architect energy or chaotic frontend rebel?');
    return starters.slice(0, 5);
  }
}
