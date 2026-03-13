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

@Entity('compatibility_history')
@Index(['matchId'])
export class CompatibilityHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @Column({ type: 'float' })
  score: number;

  @Column({ type: 'jsonb', nullable: true })
  snapshot: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Match, (match) => match.compatibilityHistory, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'matchId' })
  match: Match;
}
