import { IsBoolean, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditTaskDTO {
  @ApiProperty()
  @IsString()
  caption: string;
  @ApiProperty()
  @IsString()
  description: string;
  @ApiProperty()
  @IsBoolean()
  isComplete: boolean;
}
