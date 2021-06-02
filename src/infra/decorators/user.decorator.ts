import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserData {
  userId: number;
  username: string;
}

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): UserData => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
