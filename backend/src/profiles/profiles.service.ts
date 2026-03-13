import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Profile } from './entities/profile.entity';
import {
  ExperienceLevel,
  RelationshipGoal,
  MoodState,
} from './entities/profile.entity';

export interface UpdateProfileDto {
  displayName?: string;
  bio?: string;
  techStack?: string[];
  experienceLevel?: ExperienceLevel;
  relationshipGoal?: RelationshipGoal;
  interests?: string[];
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  currentMood?: MoodState;
  readyToMeet?: boolean;
}

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
  ) {}

  async findByUserId(userId: string): Promise<Profile | null> {
    return this.profileRepo.findOne({
      where: { userId },
      relations: ['githubDna', 'personalityVector'],
    });
  }

  async create(userId: string, dto?: Partial<Profile>): Promise<Profile> {
    const profile = this.profileRepo.create({
      userId,
      experienceLevel: ExperienceLevel.MID,
      relationshipGoal: RelationshipGoal.OPEN_SOURCE,
      techStack: [],
      interests: [],
      ...dto,
    });
    return this.profileRepo.save(profile);
  }

  async update(userId: string, dto: UpdateProfileDto): Promise<Profile> {
    const profile = await this.findByUserId(userId);
    if (!profile) throw new Error('Profile not found');
    Object.assign(profile, dto);
    if (dto.readyToMeet) profile.readyToMeetAt = new Date();
    return this.profileRepo.save(profile);
  }

  async updateMood(userId: string, mood: MoodState): Promise<Profile> {
    const profile = await this.findByUserId(userId);
    if (!profile) throw new Error('Profile not found');
    profile.currentMood = mood;
    return this.profileRepo.save(profile);
  }

  async updateReadyToMeet(userId: string, ready: boolean): Promise<Profile> {
    const profile = await this.findByUserId(userId);
    if (!profile) throw new Error('Profile not found');
    profile.readyToMeet = ready;
    if (ready) profile.readyToMeetAt = new Date();
    return this.profileRepo.save(profile);
  }
}
