export interface ResponseInterface<T> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
}


export interface PaginationOptions {
  page: number;
  limit: number;
  isPaginated?: boolean; // Optional flag to toggle pagination
  sortBy?: Record<string, 'ASC' | 'DESC'>; // Sorting options
}

export interface PaginatedResult<T> {
  data: T[];
  totalCount?: number; // Optional in case no pagination
  totalPages?: number; // Optional in case no pagination
  currentPage?: number; // Optional in case no pagination
}

export interface PaginatedResponse<T> extends ResponseInterface<T[]> {
  totalCount: number;
  totalPages: number;
  currentPage: number;
}