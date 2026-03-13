import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { GithubDna } from './github-dna.entity';
import { PersonalityVector } from './personality-vector.entity';

export enum ExperienceLevel {
  JUNIOR = 'junior',
  MID = 'mid',
  SENIOR = 'senior',
  STAFF = 'staff',
  PRINCIPAL = 'principal',
}

export enum RelationshipGoal {
  LTS = 'lts', // Long Term Support
  BETA_TESTING = 'beta_testing',
  SERVERLESS = 'serverless',
  OPEN_SOURCE = 'open_source',
  PEER_REVIEW = 'peer_review',
}

export enum MoodState {
  FOCUSED = 'focused',
  PLAYFUL = 'playful',
  ROMANTIC = 'romantic',
  ADVENTUROUS = 'adventurous',
  LOW_ENERGY = 'low_energy',
  DEEP_TALK = 'deep_talk',
}

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  userId: string;

  @Column({ nullable: true })
  displayName?: string;

  @Column({ type: 'text', nullable: true })
  bio?: string;

  @Column({ nullable: true })
  avatarUrl?: string;

  @Column('simple-array', { nullable: true })
  techStack: string[];

  @Column({ type: 'enum', enum: ExperienceLevel })
  experienceLevel: ExperienceLevel;

  @Column({ type: 'enum', enum: RelationshipGoal })
  relationshipGoal: RelationshipGoal;

  @Column('simple-array', { nullable: true })
  interests: string[];

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 10, scale: 7, nullable: true })
  longitude?: number;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ type: 'enum', enum: MoodState, nullable: true })
  currentMood?: MoodState;

  @Column({ default: false })
  readyToMeet: boolean;

  @Column({ type: 'timestamptz', nullable: true })
  readyToMeetAt?: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @OneToOne(() => GithubDna, (dna) => dna.profile)
  githubDna: GithubDna;

  @OneToOne(() => PersonalityVector, (pv) => pv.profile)
  personalityVector: PersonalityVector;
}
