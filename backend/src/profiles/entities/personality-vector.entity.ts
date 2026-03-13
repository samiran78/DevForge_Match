import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity('personality_vectors')
export class PersonalityVector {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  profileId: string;

  @Column({ type: 'jsonb' })
  vector: Record<string, number>;

  @Column({ type: 'text', nullable: true })
  romanticInclination?: string;

  @Column('simple-array', { nullable: true })
  conversationStarters: string[];

  @Column({ type: 'jsonb', nullable: true })
  rawInference: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;

  @OneToOne(() => Profile, (profile) => profile.personalityVector, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'profileId' })
  profile: Profile;
}
