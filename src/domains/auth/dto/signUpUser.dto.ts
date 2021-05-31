import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignUpUserDTO {
  @ApiProperty({ description: 'The user name for service' })
  @IsString()
  @MinLength(5)
  username: string;
  @ApiProperty({ description: 'The unique email associated with the user' })
  @IsEmail()
  email: string;
  @ApiProperty({ description: 'The password of the user' })
  @IsString()
  @MinLength(6)
  password: string;
}
