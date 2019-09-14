import {
  Injectable,
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

  async findByWhere(
    where: Partial<User>,
    fields?: Array<keyof User>,
  ): Promise<User | undefined> {
    const users = await this.userRepository.find({
      where,
      select: fields ? fields : undefined,
      take: 1,
    });

    if (users.length > 0) {
      return users[0];
    } else {
      return undefined;
    }
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

  async add(
    email: string,
    passwordHash: string,
    emailConfirmationCode: string,
  ): Promise<User | undefined> {
    const foundUser = await this.findByEmail(email);

    if (foundUser) {
      return undefined;
    } else {
      const result = await this.userRepository.insert({
        email,
        passwordHash,
        emailConfirmationCode,
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
