import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class TaskListDTO {
  @ApiProperty({ description: 'The identifier of the task list' })
  @IsNumber()
  id: number;
  @ApiProperty({ description: 'The caption of the task list' })
  @IsString()
  caption: string;
}
