import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum ReportStatus {
  PENDING = 'pending',
  REVIEWED = 'reviewed',
  ACTION_TAKEN = 'action_taken',
  DISMISSED = 'dismissed',
}

@Entity('reports')
@Index(['reporterId'])
@Index(['reportedId'])
@Index(['status'])
export class Report {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  reporterId: string;

  @Column()
  reportedId: string;

  @Column({ type: 'varchar', length: 50 })
  reason: string;

  @Column({ type: 'text', nullable: true })
  details?: string;

  @Column({ type: 'uuid', nullable: true })
  relatedMessageId?: string;

  @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING })
  status: ReportStatus;

  @Column({ type: 'uuid', nullable: true })
  reviewedBy?: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reporterId' })
  reporter: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'reportedId' })
  reported: User;
}
