import { ApiProperty } from '@nestjs/swagger';

export class TaskListDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  caption: string;
}
