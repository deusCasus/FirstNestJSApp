import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';
import { User } from '../../entities';

export interface UserData {
  id: string;
  username: string;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  async login(user: any) {
    const payload = { username: user.username };
    const accessToken = this.jwtService.sign(payload);
    return { accessToken };
  }

  async registry() {

  }
}
