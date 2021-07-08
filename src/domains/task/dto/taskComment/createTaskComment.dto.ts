import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskCommentDTO {
  @ApiProperty({ description: 'The content of the task comment' })
  @IsString()
  content: string;
}
