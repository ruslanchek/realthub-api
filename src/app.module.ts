import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PropertyModule } from './property/property.module';
import { EmailService } from './email/email.service';
import { EmailModule } from './email/email.module';
import { typeOrmConstants } from './constants';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConstants),
    AuthModule,
    UserModule,
    PropertyModule,
    EmailModule,
  ],
  providers: [EmailService],
})
export class AppModule {}
