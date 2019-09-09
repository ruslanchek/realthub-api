import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entries/user.entity';
import { IsUserAlreadyExist } from './user.validators';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, IsUserAlreadyExist],
  exports: [UserService],
})
export class UserModule {}
