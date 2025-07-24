import { registerAs } from '@nestjs/config';
import 'dotenv/config';

export default registerAs('database', () => ({
  type: 'postgres',
    database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10), 
  host: process.env.DB_HOST,
  entities: ['dist/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV !== 'production',
}));