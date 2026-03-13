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

@Entity('blocks')
@Index(['blockerId', 'blockedId'], { unique: true })
@Index(['blockedId'])
export class Block {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  blockerId: string;

  @Column()
  blockedId: string;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blockerId' })
  blocker: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'blockedId' })
  blocked: User;
}
