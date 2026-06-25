import { PaginatedResult } from '../dto/pagination-query.dto';

interface Delegate {
  findMany: (args: any) => Promise<any[]>;
  count: (args: any) => Promise<number>;
}

/**
 * Generic Prisma pagination helper.
 * Usage: paginate(prisma.partner, { page, limit }, { where, orderBy })
 */
export async function paginate<T>(
  model: Delegate,
  { page = 1, limit = 20 }: { page?: number; limit?: number },
  args: { where?: any; orderBy?: any; include?: any; select?: any } = {},
): Promise<PaginatedResult<T>> {
  const skip = (page - 1) * limit;
  const [data, total] = await Promise.all([
    model.findMany({ ...args, skip, take: limit }),
    model.count({ where: args.where }),
  ]);
  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit) || 1,
    },
  };
}
