import { ApiProperty } from '@nestjs/swagger';

const EXAMPLE_JWT_ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

export class TokenPairDTO {
  @ApiProperty({
    description: 'The JWT token for access in system',
    example: EXAMPLE_JWT_ACCESS_TOKEN,
  })
  accessToken: string;
}
