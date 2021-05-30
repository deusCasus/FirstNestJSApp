import { ApiProperty } from '@nestjs/swagger';

export class MainUserDataDto {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
}
