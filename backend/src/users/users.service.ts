import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from './entities/user.entity';
import { UserRole } from './entities/user.entity';

export interface CreateUserDto {
  email: string;
  passwordHash?: string;
  githubId?: string;
  githubUsername?: string;
  avatarUrl?: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async findById(id: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { id } });
  }

  async findByIdWithProfile(id: string): Promise<User | null> {
    return this.userRepo.findOne({
      where: { id },
      relations: ['profile', 'profile.githubDna', 'profile.personalityVector'],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { email: email.toLowerCase() } });
  }

  async findByGithubId(githubId: string): Promise<User | null> {
    return this.userRepo.findOne({ where: { githubId } });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const user = this.userRepo.create({
      email: dto.email.toLowerCase(),
      passwordHash: dto.passwordHash,
      githubId: dto.githubId,
      githubUsername: dto.githubUsername,
      avatarUrl: dto.avatarUrl,
      role: UserRole.USER,
    });
    return this.userRepo.save(user);
  }

  async linkGithub(userId: string, githubId: string, githubUsername: string): Promise<void> {
    await this.userRepo.update(userId, { githubId, githubUsername });
  }

  async updateProfileComplete(userId: string, complete: boolean): Promise<void> {
    await this.userRepo.update(userId, { profileComplete: complete });
  }
}
