export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
}

export function successResponse<T>(
  message: string,
  items: T,
  pagination: PaginationMeta | null = null,
  statusCode = 200,
) {
  return {
    success: true,
    message,
    statusCode,
    data: {
      items,
      pagination,
    },
  };
}
