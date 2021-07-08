import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditTaskListDTO {
  @ApiProperty({ description: 'The updated caption of the task list' })
  @IsString()
  caption: string;
}
