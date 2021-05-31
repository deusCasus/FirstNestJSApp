import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskListDTO {
  @ApiProperty({ description: 'The caption of the task list' })
  @IsString()
  @ApiProperty({ description: 'The description of the task list' })
  caption: string;
}
