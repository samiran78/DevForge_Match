import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('sponsored_venues')
export class SponsoredVenue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  placeId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  affiliateLink?: string;

  @Column({ type: 'float', default: 1 })
  boostWeight: number;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
