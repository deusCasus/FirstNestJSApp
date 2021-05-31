import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDTO {
  @ApiProperty()
  @IsString()
  caption: string;
  @ApiProperty()
  @IsString()
  description: string;
}
