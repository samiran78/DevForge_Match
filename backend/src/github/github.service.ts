import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GithubDna, AuraType } from '../profiles/entities/github-dna.entity';

interface RepoAnalysis {
  languages: Record<string, number>;
  commitCount: number;
  readmeLength: number;
  stars: number;
  forks: number;
}

@Injectable()
export class GithubService {
  constructor(
    @InjectRepository(GithubDna)
    private readonly githubDnaRepo: Repository<GithubDna>,
  ) {}

  async analyzeAndStore(profileId: string, githubUsername: string): Promise<GithubDna> {
    const analysis = await this.fetchAndAnalyze(githubUsername);
    const existing = await this.githubDnaRepo.findOne({ where: { profileId } });
    const dna = existing
      ? await this.githubDnaRepo.save({
          ...existing,
          ...analysis,
          githubUsername,
        })
      : await this.githubDnaRepo.save({
          profileId,
          githubUsername,
          ...analysis,
        });
    return dna;
  }

  private async fetchAndAnalyze(username: string): Promise<Partial<GithubDna>> {
    // In production: call GitHub API
    // GET /users/:username/repos, GET /repos/:owner/:repo/languages, etc.
    const token = process.env.GITHUB_TOKEN;
    let repos: any[] = [];

    if (token) {
      try {
        const res = await fetch(
          `https://api.github.com/users/${username}/repos?per_page=100`,
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (res.ok) repos = await res.json();
      } catch (e) {
        console.warn('GitHub API error:', e);
      }
    }

    const langDist: Record<string, number> = {};
    let totalCommits = 0;
    let totalReadme = 0;
    let complexity = 0;

    for (const repo of repos) {
      const lang = repo.language || 'Other';
      langDist[lang] = (langDist[lang] || 0) + 1;
      totalCommits += repo.size || 0;
      totalReadme += repo.description?.length || 0;
      complexity += (repo.stargazers_count || 0) * 2 + (repo.forks_count || 0);
    }

    const totalRepos = repos.length || 1;
    const commitFrequency = totalCommits / totalRepos;
    const docRatio = totalReadme > 0 ? Math.min(1, totalReadme / (totalRepos * 500)) : 0.3;
    const complexityScore = Math.min(1, complexity / 100);

    const radarScores = {
      documentation: docRatio,
      frequency: Math.min(1, commitFrequency / 50),
      complexity: complexityScore,
      diversity: Math.min(1, Object.keys(langDist).length / 5),
      maintainer: repos.some((r: any) => r.owner?.login === username) ? 0.8 : 0.3,
    };

    const auraType = this.classifyAura(radarScores, langDist);

    return {
      languageDistribution: langDist,
      commitFrequency,
      documentationRatio: docRatio,
      complexityScore,
      radarScores,
      auraType,
      rawAnalysis: { repos: repos.length },
    };
  }

  private classifyAura(
    radar: Record<string, number>,
    langDist: Record<string, number>,
  ): AuraType {
    if (radar.documentation > 0.7) return AuraType.GREEN;
    if (radar.frequency > 0.8) return AuraType.BLUE;
    const langs = Object.keys(langDist);
    if (langs.some((l) => ['C', 'C++', 'Rust', 'Go'].includes(l))) return AuraType.RED;
    if (langs.length >= 4) return AuraType.PURPLE;
    if (radar.maintainer > 0.6) return AuraType.GOLD;
    return AuraType.PURPLE;
  }
}
