import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Payload, JWTDecodeValue } from '../auth.interface';
import jwtDecode from 'jwt-decode';
import { SignUpInput } from '../dto/auth.dto';
import * as bcrypt from 'bcryptjs';
import { ApolloError } from 'apollo-server';
import { UserService } from 'src/modules/users/services/user.service';

type JwtGenerateOption = {
  audience?: string | string[];
  issuer?: string;
  jwtid?: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string) {
    const user = await this.usersService.login(email, pass);

    const { password, passwordSalt, ...result } = user;
    return result;
  }

  async login(email: string, password: string) {
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new ApolloError('Error');
    }

    try {
      const authToken = this.saveAuthToken(user.id, user.username, {
        issuer: 'frontend',
        audience: ['app'],
      });
      if (!authToken) {
        throw new ApolloError('Error');
      }

      return {
        user,
        accessToken: authToken?.accessToken,
        refreshToken: authToken?.refreshToken,
      };
    } catch (err) {
      throw new ApolloError('Error');
    }
  }

  initAccessToken(data: { payload: Payload; options?: JwtGenerateOption }) {
    const { payload, options } = data;
    return {
      accessToken: this.jwtService.sign(payload, {
        ...options,
        expiresIn: `30 days`,
        secret: process.env.SECRET,
      }),
      refreshToken: this.jwtService.sign(payload, {
        ...options,
        expiresIn: `35 days`,
        secret: process.env.SECRET,
      }),
    };
  }

  saveAuthToken(userId: number, username: string, options?: JwtGenerateOption) {
    const { accessToken, refreshToken } = this.initAccessToken({
      payload: {
        sub: userId,
        username,
      },
      options,
    });
    return { accessToken, refreshToken };
  }

  getUserByToken(token: string) {
    const decode = jwtDecode<JWTDecodeValue>(token);
    return this.usersService.findByUserName(decode.username);
  }

  async signUp(input: SignUpInput) {
    const { username, password } = input;

    const salt = bcrypt.genSaltSync();
    const hashPassword = bcrypt.hashSync(password, salt);

    const savedUser = await this.usersService.create({
      username,
      password: hashPassword,
      passwordSalt: salt,
    });

    try {
      const authToken = this.saveAuthToken(savedUser.id, savedUser.username, {
        issuer: 'frontend',
        audience: ['app'],
      });

      if (!authToken) {
        throw new ApolloError('Error');
      }

      return {
        savedUser,
        accessToken: authToken?.accessToken,
        refreshToken: authToken?.refreshToken,
      };
    } catch (error) {
      throw new ApolloError(error);
    }
  }
}
