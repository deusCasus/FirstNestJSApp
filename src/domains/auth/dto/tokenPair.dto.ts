import { ApiProperty } from '@nestjs/swagger';

export class TokenPairDTO {
  @ApiProperty()
  accessToken: string;
}
