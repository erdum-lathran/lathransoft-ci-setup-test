import { HttpStatus } from '@nestjs/common';
import { ResponseInterface } from 'src/interface/index.interface';

export class ResponseUtil {
  static success<T>(
    data: T,
    message: string = 'Operation successful',
    statusCode: number = HttpStatus.OK,
    totalCount?: number, // Optional for paginated responses
    totalPages?: number, // Optional for paginated responses
    currentPage?: number, // Optional for paginated responses
  ): ResponseInterface<T> {
    return {
      statusCode: statusCode,
      success: true,
      message,
      data,
      ...(totalCount !== undefined ? { totalCount } : {}),
      ...(totalPages !== undefined ? { totalPages } : {}),
      ...(currentPage !== undefined ? { currentPage } : {}),
    };
  }
}