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
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(
    email: string,
    fields?: Array<keyof User>,
  ): Promise<User | undefined> {
    const users = await this.userRepository.find({
      where: {
        email,
      },
      select: fields ? fields : undefined,
    });

    return users.length > 0 ? users[0] : undefined;
  }

  async findById(
    id: string,
    fields?: Array<keyof User>,
  ): Promise<User | undefined> {
    const users = await this.userRepository.find({
      where: {
        id,
      },
      select: fields ? fields : undefined,
    });

    return users.length > 0 ? users[0] : undefined;
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
