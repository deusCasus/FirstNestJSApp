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
import {
  MainUserDataDTO,
  SignInUserDTO,
  SignUpUserDTO,
  TokenPairDTO,
} from './dto';
import { User } from '../../infra/decorators';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private service: AuthService) {}

  @ApiOperation({
    summary: 'Get user main data',
    description: 'Work only for the authentication user',
  })
  @ApiResponse({ type: MainUserDataDTO, status: 200 })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('/auth')
  getUserData(@User() user: any): Promise<MainUserDataDTO> {
    return this.service.getUser(user.userId);
  }

  @ApiOperation({ summary: 'Sign in to the system' })
  @ApiBody({ type: SignInUserDTO })
  @ApiResponse({ type: TokenPairDTO, status: 200 })
  @ApiResponse({
    status: 404,
    description:
      'Status will be send, in the case, where email or password is incorrect',
  })
  @UseGuards(LocalAuthGuard)
  @Post('auth/signIn')
  async login(@Request() req: any): Promise<TokenPairDTO> {
    return this.service.login(req.user);
  }

  @ApiOperation({ summary: 'Sign up to the system' })
  @ApiBody({ type: SignUpUserDTO })
  @ApiResponse({ status: 200, description: "Response hasn't body" })
  @ApiResponse({
    status: 400,
    description:
      'Status will be send, in the case, where email already exist in the system',
  })
  @Post('auth/signUp')
  async registry(@Body() signUpUser: SignUpUserDTO): Promise<void> {
    await this.service.registry(signUpUser);
  }
}
