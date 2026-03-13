import { DataSource } from 'typeorm';

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL || 'postgresql://devmatch:devmatch_secret@localhost:5432/devmatch',
  entities: ['src/**/*.entity{.ts,.js}'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
});
