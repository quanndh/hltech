import { EntityRepository, RequiredEntityData } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Injectable } from '@nestjs/common';
import { User } from 'src/modules/users/entities/user.entity';
import * as bcrypt from 'bcryptjs';
import { ApolloError } from 'apollo-server';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: EntityRepository<User>,
  ) {}

  create = async (data: RequiredEntityData<User>) => {
    const newInstance = this.userRepository.create(data);
    await this.userRepository.persist(newInstance).flush();

    return newInstance;
  };

  findByUserName = (username: string) => {
    return this.userRepository.findOne({ username });
  };

  async login(username: string, password: string) {
    const user = await this.findByUserName(username);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      throw new ApolloError(
        'Email or password incorrect.',
        'email_password_incorrect',
      );
    }

    return user;
  }
}
