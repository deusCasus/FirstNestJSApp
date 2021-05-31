import { ApiProperty } from '@nestjs/swagger';

export class MainUserDataDTO {
  @ApiProperty()
  id: number;
  @ApiProperty()
  username: string;
  @ApiProperty()
  email: string;
}
