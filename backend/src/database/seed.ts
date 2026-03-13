import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../users/entities/user.entity';
import { Profile } from '../profiles/entities/profile.entity';
import { ExperienceLevel, RelationshipGoal } from '../profiles/entities/profile.entity';

const ds = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://devmatch:devmatch_secret@localhost:5432/devmatch',
  entities: ['src/**/*.entity{.ts,.js}'],
  synchronize: false,
});

async function seed() {
  await ds.initialize();
  const userRepo = ds.getRepository(User);
  const profileRepo = ds.getRepository(Profile);

  const hash = await bcrypt.hash('password123', 12);

  const users = [
    { email: 'alice@devmatch.io', passwordHash: hash, role: UserRole.USER, profileComplete: true },
    { email: 'bob@devmatch.io', passwordHash: hash, role: UserRole.USER, profileComplete: true },
    { email: 'carol@devmatch.io', passwordHash: hash, role: UserRole.USER, profileComplete: true },
  ];

  for (const u of users) {
    const existing = await userRepo.findOne({ where: { email: u.email } });
    if (!existing) {
      const user = await userRepo.save(userRepo.create(u));
      await profileRepo.save({
        userId: user.id,
        displayName: u.email.split('@')[0],
        techStack: ['TypeScript', 'React', 'Node.js'],
        experienceLevel: ExperienceLevel.MID,
        relationshipGoal: RelationshipGoal.OPEN_SOURCE,
        interests: ['coding', 'coffee', 'hiking'],
      });
      console.log('Created user:', u.email);
    }
  }

  await ds.destroy();
  console.log('Seed complete');
}

seed().catch(console.error);
