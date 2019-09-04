import {
  Injectable,
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entries/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | undefined> {
    const [users, count] = await this.userRepository.findAndCount({
      email,
    });

    return count ? users[0] : undefined;
  }

  async findById(id: string): Promise<User | undefined> {
    return await this.userRepository.findOne(id);
  }

  async update(id: string, userData: Partial<User>): Promise<User | undefined> {
    const foundUser = await this.findById(id);

    if (foundUser) {
      await this.userRepository.update(id, userData);
      return await this.userRepository.findOne(id);
    } else {
      throw new NotFoundException();
    }
  }

  async add(email: string, passwordHash: string): Promise<User | undefined> {
    const foundUser = await this.findByEmail(email);

    if (foundUser) {
      throw new ConflictException('EMAIL_CONFLICT', '1');
    } else {
      const result = await this.userRepository.insert({
        email,
        passwordHash,
      });

      if (result.identifiers.length > 0) {
        const { id } = result.identifiers[0];
        return await this.userRepository.findOne(id);
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
}
