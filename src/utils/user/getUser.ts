import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../modules/user/model';

export const GetUser = createParamDecorator(
  (_: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as User;

    return user;
  },
);