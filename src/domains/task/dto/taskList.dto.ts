import { ApiProperty } from '@nestjs/swagger';

export class TaskListDTO {
  @ApiProperty({ description: 'The identifier of the task list' })
  id: number;
  @ApiProperty({ description: 'The caption of the task list' })
  caption: string;
}
