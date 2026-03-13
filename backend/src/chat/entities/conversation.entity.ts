import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { Match } from '../../matching/entities/match.entity';
import { Message } from './message.entity';

@Entity('conversations')
@Index(['matchId'], { unique: true })
export class Conversation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  matchId: string;

  @Column({ type: 'timestamptz', nullable: true })
  lastMessageAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Match, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'matchId' })
  match: Match;

  @OneToMany(() => Message, (message) => message.conversation)
  messages: Message[];
}
