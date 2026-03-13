import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Match } from '../../matching/entities/match.entity';

@Entity('date_plans')
@Index(['matchId'])
export class DatePlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'int' }) // minutes
  durationMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  estimatedBudget?: number;

  @Column({ type: 'jsonb', nullable: true })
  venues: Array<{
    placeId: string;
    name: string;
    type: string;
    rating?: number;
    address?: string;
  }>;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  midpointLat?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  midpointLng?: number;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Match, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'matchId' })
  match: Match;
}
