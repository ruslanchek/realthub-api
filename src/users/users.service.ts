import { Injectable } from '@nestjs/common';
import { IUser } from '../meta/interfaces';

@Injectable()
export class UsersService {
  private readonly users: IUser[];

  constructor() {
    this.users = [];
  }

  async findOne(username: string): Promise<IUser | undefined> {
    return this.users.find(user => user.username === username);
  }

  async add(
    username: string,
    passwordHash: string,
  ): Promise<IUser | undefined> {
    const user = {
      id: Math.random().toString(),
      username,
      passwordHash,
    };

    this.users.push(user);

    return user;
  }
}
