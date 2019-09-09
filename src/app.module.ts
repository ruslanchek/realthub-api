import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PropertyModule } from './property/property.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || '',
      port: parseInt(process.env.POSTGRES_PORT || '', 10),
      username: process.env.POSTGRES_USERNAME || '',
      password: process.env.POSTGRES_PASSWORD || '',
      database: process.env.POSTGRES_DATABASE || '',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: process.env.POSTGRES_SYNCHRONIZE === '1' ? true : false,
      ssl: process.env.POSTGRES_SSL === '1' ? true : false,
    }),
    AuthModule,
    UserModule,
    PropertyModule,
  ],
})
export class AppModule {}
