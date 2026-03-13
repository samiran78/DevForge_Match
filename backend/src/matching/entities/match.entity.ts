import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ChemistryScore } from './chemistry-score.entity';
import { CompatibilityHistory } from './compatibility-history.entity';

@Entity('matches')
@Index(['user1Id', 'user2Id'], { unique: true })
@Index(['user1Id'])
@Index(['user2Id'])
export class Match {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  user1Id: string;

  @Column()
  user2Id: string;

  @Column({ type: 'float', default: 0 })
  baseScore: number;

  @Column({ default: false })
  chemistryRevealed: boolean;

  @Column({ default: false })
  flirtModeUnlocked: boolean;

  @Column({ default: 0 })
  messageCount: number;

  @Column({ default: false })
  smartDateUnlocked: boolean;

  @Column({ default: false })
  stableConnection: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user1Id' })
  user1: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user2Id' })
  user2: User;

  @OneToMany(() => ChemistryScore, (cs) => cs.match)
  chemistryScores: ChemistryScore[];

  @OneToMany(() => CompatibilityHistory, (ch) => ch.match)
  compatibilityHistory: CompatibilityHistory[];
}
