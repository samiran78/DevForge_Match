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

@Entity('swipes')
@Index(['swiperId', 'swipedId'], { unique: true })
@Index(['swipedId'])
export class Swipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  swiperId: string;

  @Column()
  swipedId: string;

  @Column() // true = right (interested), false = left (pass)
  direction: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'swiperId' })
  swiper: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'swipedId' })
  swiped: User;
}
