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

@Entity('video_sessions')
@Index(['matchId'])
export class VideoSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @Column()
  roomId: string;

  @Column({ type: 'int', default: 0 }) // seconds
  durationSeconds: number;

  @Column({ type: 'jsonb', nullable: true })
  user1Feedback?: { energyMatch: number; comfortLevel: number; interestLevel: number };

  @Column({ type: 'jsonb', nullable: true })
  user2Feedback?: { energyMatch: number; comfortLevel: number; interestLevel: number };

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Match, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'matchId' })
  match: Match;
}
