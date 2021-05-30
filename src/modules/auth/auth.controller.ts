import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard, LocalAuthGuard } from './guard';
import { AuthService } from './auth.service';
import { MainUserDataDto, SignInUserDTO, SignUpUserDTO, TokenPairDto } from './dto';
import { User } from '../../infra/decorator';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Authentication')
export class AuthController {
  constructor(private service: AuthService) {}

  @ApiResponse({ type: MainUserDataDto, status: 200 })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/auth')
  getUserData(@User() user: any): Promise<MainUserDataDto> {
    return this.service.getUser(user.userId);
  }


  @ApiBody({ type: SignInUserDTO })
  @ApiResponse({ type: TokenPairDto, status: 200 })
  @UseGuards(LocalAuthGuard)
  @Post('auth/signIn')
  async login(@Request() req: any): Promise<TokenPairDto> {
    return this.service.login(req.user);
  }

  @ApiBody({ type: SignUpUserDTO })
  @ApiResponse({ status: 200 })
  @Post('auth/signUp')
  async registry(@Body() signUpUser: SignUpUserDTO): Promise<void> {
    await this.service.registry(signUpUser);
  }
}
