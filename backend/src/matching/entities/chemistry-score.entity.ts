import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Match } from './match.entity';

@Entity('chemistry_scores')
@Index(['matchId'])
export class ChemistryScore {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @Column({ type: 'int' }) // 0-100
  score: number;

  @Column({ type: 'jsonb' })
  breakdown: Record<string, number>;

  @Column({ type: 'text', nullable: true })
  aiInsight?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Match, (match) => match.chemistryScores, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'matchId' })
  match: Match;
}
