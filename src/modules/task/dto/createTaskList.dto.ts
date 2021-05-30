import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskListDTO {
  @ApiProperty()
  @IsString()
  caption: string;
}
