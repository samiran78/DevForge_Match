import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

export enum AuraType {
  GREEN = 'green', // Documentation heavy / OSS contributor
  BLUE = 'blue', // High-frequency committer (Grinder)
  RED = 'red', // Algorithm specialist
  PURPLE = 'purple', // Full-stack generalist
  GOLD = 'gold', // Maintainer / Architect
}

@Entity('github_dna')
export class GithubDna {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  profileId: string;

  @Column({ nullable: true })
  githubUsername?: string;

  @Column({ type: 'jsonb', nullable: true })
  languageDistribution: Record<string, number>;

  @Column({ type: 'float', default: 0 })
  commitFrequency: number;

  @Column({ type: 'float', default: 0 })
  documentationRatio: number;

  @Column({ type: 'float', default: 0 })
  complexityScore: number;

  @Column({ type: 'jsonb', nullable: true })
  radarScores: Record<string, number>;

  @Column({ type: 'enum', enum: AuraType })
  auraType: AuraType;

  @Column({ type: 'jsonb', nullable: true })
  rawAnalysis: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Profile, (profile) => profile.githubDna, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profileId' })
  profile: Profile;
}
