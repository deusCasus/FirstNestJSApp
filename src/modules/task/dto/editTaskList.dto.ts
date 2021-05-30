import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditTaskListDTO {
  @ApiProperty()
  @IsString()
  caption: string;
}
