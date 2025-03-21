import { Query, Types } from 'mongoose';
import type { PaginationParams } from './pagination.decorator';

export type Paginatted<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

type DocQuery<TModel extends object> = Query<Omit<TModel & { _id: Types.ObjectId }, never>[], TModel & { _id: Types.ObjectId }>;

export async function pagination<TModel extends object>(dataQueryModel: DocQuery<TModel>, countDoc: DocQuery<TModel>, { page, limit }: PaginationParams): Promise<Paginatted<TModel>> {
  const offset = (page - 1) * limit;

  const items = await dataQueryModel.skip(offset).limit(limit).exec();
  const total = await countDoc.countDocuments().exec();

  return {
    items,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
}
