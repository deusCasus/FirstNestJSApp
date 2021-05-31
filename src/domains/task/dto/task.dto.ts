import { ApiProperty } from '@nestjs/swagger';

export class TaskDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  caption: string;
  @ApiProperty()
  description: string;
  @ApiProperty()
  isComplete: boolean;
}
