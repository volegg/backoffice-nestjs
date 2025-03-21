import { Query, Types } from 'mongoose';
import type { PaginationParams } from './pagination.decorator';

export type Paginatted<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function pagination<TModel extends Object>(queryModel: Query<Omit<TModel & { _id: Types.ObjectId }, never>[], TModel & { _id: Types.ObjectId }>, { page, limit }: PaginationParams): Promise<Paginatted<TModel>> {
  const offset = (page - 1) * limit;

  const items = await queryModel.skip(offset).limit(limit).exec();
  // const total = await queryModel.countDocuments().exec();
  const total = 10;

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
