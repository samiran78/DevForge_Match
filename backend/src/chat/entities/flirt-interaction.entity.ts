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

@Entity('flirt_interactions')
@Index(['matchId'])
export class FlirtInteraction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @Column()
  initiatorId: string;

  @Column({ type: 'varchar', length: 50 })
  interactionType: string; // voice_note, reaction, prompt_used

  @Column({ type: 'text', nullable: true })
  content?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => Match, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'matchId' })
  match: Match;
}
