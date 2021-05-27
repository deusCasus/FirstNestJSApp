import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserEntity } from '../../entities';
import { SignUpUserDto } from './dto';
import { TokenPair, UserResponse } from './interface';

export interface UserData {
  id: string;
  username: string;
  email: string;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
}

export interface UserData {
  id: string;
  username: string;
  email: string;
}

const HASH_ROUNDS = 3;

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) {
  }

  async validateUser(email: string, password: string): Promise<UserData | null> {
    const lowCaseEmail = email.toLowerCase();
    const user = await this.userRepository.findOne({
      where: { email: lowCaseEmail }
    });

    if (!user) return null;
    const isPassMatch = await bcrypt.compare(password, user.password);
    if (!isPassMatch) return null;

    return {
      id: user.id,
      username: user.username,
      email: lowCaseEmail
    };
  }

  async getUser(userId: string): Promise<UserResponse> {
    const user = await this.userRepository.findOne(userId);
    if (!user) throw new NotFoundException();
    return {
      id: user.id,
      email: user.email,
      username: user.username
    }
  }

  async login(user: any): Promise<TokenPair> {
    const payload = { username: user.username, sub: user.userId };
    return { accessToken: this.jwtService.sign(payload), };
  }

  async registry(user: SignUpUserDto): Promise<UserEntity> {
    const emailInLowerCase = user.email.toLowerCase();
    const searchedUser = await this.userRepository.findOne({
      where: { email: emailInLowerCase }
    });

    if (searchedUser) {
      throw new BadRequestException();
    }

    const encryptedPass = await bcrypt.hash(user.password, HASH_ROUNDS);
    return await this.userRepository.save({
      username: user.username,
      email: emailInLowerCase,
      password: encryptedPass
    });
  }
}
