import {
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USERNAME,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
  POSTGRES_SYNCHRONIZE,
  POSTGRES_SSL,
} from './env';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
  expiresIn: '30d',
};

export const authConstants = {
  passwordResetExpires: 1000 * 60 * 10,
  passwordResetInterval: 1000 * 60 * 5,
};

export const typeOrmConstants: TypeOrmModuleOptions = {
  type: 'postgres',
  host: POSTGRES_HOST || '',
  port: parseInt(POSTGRES_PORT || '', 10),
  username: POSTGRES_USERNAME || '',
  password: POSTGRES_PASSWORD || '',
  database: POSTGRES_DATABASE || '',
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: POSTGRES_SYNCHRONIZE === '1' ? true : false,
  ssl: POSTGRES_SSL === '1' ? true : false,
};
