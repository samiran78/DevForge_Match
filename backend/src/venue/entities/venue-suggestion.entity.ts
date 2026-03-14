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

@Entity('venue_suggestions')
@Index(['matchId'])
export class VenueSuggestion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @Column()
  placeId: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  type: string;

  @Column({ type: 'float', nullable: true })
  rating?: number;

  @Column({ type: 'text', nullable: true })
  address?: string;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @Column({ type: 'float', nullable: true })
  distance?: number;

  @Column('simple-array', { nullable: true })
  ambienceTags: string[];

  @Column({ default: false })
  isSponsored: boolean;

  @Column({ nullable: true })
  affiliateLink?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Match, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'matchId' })
  match: Match;
}
