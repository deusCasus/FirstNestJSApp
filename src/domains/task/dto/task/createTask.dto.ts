import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDTO {
  @ApiProperty({ description: 'The caption of the task' })
  @IsString()
  caption: string;
  @ApiProperty({ description: 'The description of the task' })
  @IsString()
  description: string;
}
