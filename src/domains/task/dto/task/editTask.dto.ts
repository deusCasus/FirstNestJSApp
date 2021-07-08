import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditTaskDTO {
  @ApiProperty({ description: 'The updated caption of the task' })
  @IsString()
  caption: string;
  @ApiProperty({ description: 'The updated description of the task' })
  @IsString()
  description: string;
  @ApiProperty({ description: 'The updated status of the task' })
  @IsBoolean()
  isComplete: boolean;
}
