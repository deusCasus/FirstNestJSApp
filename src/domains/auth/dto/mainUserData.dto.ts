import { ApiProperty } from '@nestjs/swagger';

export class MainUserDataDTO {
  @ApiProperty({ description: 'The identifier of the user' })
  id: number;
  @ApiProperty({ description: 'The user name for service' })
  username: string;
  @ApiProperty({ description: 'The unique email associated with the user' })
  email: string;
}
