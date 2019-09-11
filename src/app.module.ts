import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PropertyModule } from './property/property.module';
import {
import { EmailService } from './email/email.service';
  POSTGRES_HOST,
  POSTGRES_PORT,
  POSTGRES_USERNAME,
  POSTGRES_PASSWORD,
  POSTGRES_DATABASE,
  POSTGRES_SYNCHRONIZE,
  POSTGRES_SSL,
} from './env';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: POSTGRES_HOST || '',
      port: parseInt(POSTGRES_PORT || '', 10),
      username: POSTGRES_USERNAME || '',
      password: POSTGRES_PASSWORD || '',
      database: POSTGRES_DATABASE || '',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: POSTGRES_SYNCHRONIZE === '1' ? true : false,
      ssl: POSTGRES_SSL === '1' ? true : false,
    }),
    AuthModule,
    UserModule,
    PropertyModule,
  ],
  providers: [EmailService],
})
export class AppModule {}
