import { ApiProperty } from '@nestjs/swagger';

export class TaskDTO {
  @ApiProperty({ description: 'The identifier of the task' })
  id: number;
  @ApiProperty({ description: 'The caption of the task' })
  caption: string;
  @ApiProperty({ description: 'The description of the task' })
  description: string;
  @ApiProperty({ description: 'The status of the task' })
  isComplete: boolean;
}
