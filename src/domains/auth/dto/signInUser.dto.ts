import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInUserDTO {
  @ApiProperty({ description: 'The unique email associated with the user' })
  @IsEmail()
  email: string;
  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  password: string;
}
