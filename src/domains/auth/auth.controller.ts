import {
  Controller,
  Post,
  UseGuards,
  Request,
  Body,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard, LocalAuthGuard } from './guards';
import { AuthService } from './auth.service';
import { MainUserDataDTO, SignInUserDTO, SignUpUserDTO, TokenPairDTO } from './dto';
import { User } from '../../infra/decorators';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Authentication')
export class AuthController {
  constructor(private service: AuthService) {}

  @ApiResponse({ type: MainUserDataDTO, status: 200 })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/auth')
  getUserData(@User() user: any): Promise<MainUserDataDTO> {
    return this.service.getUser(user.userId);
  }


  @ApiBody({ type: SignInUserDTO })
  @ApiResponse({ type: TokenPairDTO, status: 200 })
  @UseGuards(LocalAuthGuard)
  @Post('auth/signIn')
  async login(@Request() req: any): Promise<TokenPairDTO> {
    return this.service.login(req.user);
  }

  @ApiBody({ type: SignUpUserDTO })
  @ApiResponse({ status: 200 })
  @Post('auth/signUp')
  async registry(@Body() signUpUser: SignUpUserDTO): Promise<void> {
    await this.service.registry(signUpUser);
  }
}
