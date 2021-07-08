import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class TaskCommentDTO {
  @ApiProperty({ description: 'The identifier of the task comment' })
  @IsNumber()
  id: number;
  @ApiProperty({ description: 'The content of the task comment' })
  @IsString()
  content: string;
  @ApiProperty({ description: 'The identifier of the task' })
  @IsString()
  taskId: number;
  @ApiProperty({ description: 'The identifier of the task creator' })
  @IsString()
  creatorId: number;
}
