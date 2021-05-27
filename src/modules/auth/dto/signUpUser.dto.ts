import { IsEmail, IsString, MinLength } from 'class-validator';


export class SignUpUserDto {
  @IsString()
  @MinLength(5)
  username: string;
  @IsEmail()
  email: string;
  @IsString()
  @MinLength(6)
  password: string;
}
