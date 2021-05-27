import { Controller, Post, UseGuards, Request, Body, Get } from '@nestjs/common';
import { JwtAuthGuard, LocalAuthGuard } from './guard';
import { AuthService } from './auth.service';
import { SignUpUserDto } from './dto';
import { TokenPair, UserResponse } from './interface';
import { User } from '../../infra/decorator';


@Controller()
export class AuthController {
  constructor(
    private service: AuthService
  ) {}


  @UseGuards(JwtAuthGuard)
  @Get('/auth')
  getUserData(@User() user: any): Promise<UserResponse> {
    return this.service.getUser(user.userId)
  }

  @UseGuards(LocalAuthGuard)
  @Post('auth/signIn')
  async login(@Request() req: any): Promise<TokenPair> {
    return this.service.login(req.user);
  }

  @Post('auth/signUp')
  async registry(@Body() signUpUser: SignUpUserDto): Promise<void> {
    await this.service.registry(signUpUser)
  }

}
