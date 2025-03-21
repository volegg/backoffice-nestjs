import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type PaginationParams = {
  page: number;
  limit: number;
}

export const Pagination = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): PaginationParams => {
    const request = ctx.switchToHttp().getRequest();
    const query = request.query;

    return {
      page: Math.max(parseInt(String(query.page), 10) || 1, 1),
      limit: Math.max(parseInt(String(query.limit), 10) || 10, 1),
    };
  },
);