import { Injectable } from '@nestjs/common';

@Injectable()
export class LlmService {
  async inferPersonality(input: {
    bio?: string;
    githubReadmeTone?: string;
    techStack: string[];
    relationshipGoal: string;
  }): Promise<{
    vector: Record<string, number>;
    romanticInclination: string;
    conversationStarters: string[];
  }> {
    const provider = process.env.LLM_PROVIDER || 'openai';
    const apiKey = provider === 'openai' ? process.env.OPENAI_API_KEY : process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return this.fallbackInference(input);
    }

    try {
      if (provider === 'openai') {
        return await this.callOpenAI(input, apiKey);
      }
      return await this.callAnthropic(input, apiKey);
    } catch (e) {
      console.warn('LLM inference failed, using fallback:', e);
      return this.fallbackInference(input);
    }
  }

  private async callOpenAI(
    input: any,
    apiKey: string,
  ): Promise<{ vector: Record<string, number>; romanticInclination: string; conversationStarters: string[] }> {
    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You analyze developer profiles and return a JSON object with:
- vector: object with keys analytical, creative, collaborative, independent, adventurous, pragmatic (each 0-1)
- romanticInclination: one short phrase
- conversationStarters: array of 3 playful, tasteful icebreaker questions for developers`,
          },
          {
            role: 'user',
            content: `Bio: ${input.bio || 'N/A'}. Tech: ${(input.techStack || []).join(', ')}. Goal: ${input.relationshipGoal}. Return only valid JSON.`,
          },
        ],
        response_format: { type: 'json_object' },
      }),
    });
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    const text = data.choices?.[0]?.message?.content || '{}';
    return JSON.parse(text);
  }

  private async callAnthropic(
    input: any,
    apiKey: string,
  ): Promise<{ vector: Record<string, number>; romanticInclination: string; conversationStarters: string[] }> {
    const res = await fetch(
      'https://api.anthropic.com/v1/messages',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-haiku-20240307',
          max_tokens: 512,
          messages: [
            {
              role: 'user',
              content: `Analyze this developer profile and return JSON: { "vector": { "analytical": 0-1, "creative": 0-1, "collaborative": 0-1, "independent": 0-1, "adventurous": 0-1, "pragmatic": 0-1 }, "romanticInclination": "short phrase", "conversationStarters": ["q1","q2","q3"] }. Bio: ${input.bio || 'N/A'}. Tech: ${(input.techStack || []).join(', ')}. Goal: ${input.relationshipGoal}. Return only JSON.`,
            },
          ],
        }),
      },
    );
    if (!res.ok) throw new Error(await res.text());
    const data = await res.json();
    const text = data.content?.[0]?.text || '{}';
    return JSON.parse(text.replace(/```json\n?|\n?```/g, ''));
  }

  private fallbackInference(input: any): {
    vector: Record<string, number>;
    romanticInclination: string;
    conversationStarters: string[];
  } {
    const personalityEngine = require('./personality.engine').PersonalityEngine;
    const engine = new personalityEngine();
    return engine.infer(input) as any;
  }
}
