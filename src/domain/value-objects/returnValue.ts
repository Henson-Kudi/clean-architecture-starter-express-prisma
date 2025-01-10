import AppError from './appError';

export class ReturnValue<Data = unknown> {
  constructor(
    success: boolean,
    message?: string,
    data?: Data,
    error?: AppError
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  success: boolean;
  message?: string;
  data?: Data;
  error?: AppError;
}

export interface PaginationData<Data> {
  limit: number;
  total: number;
  page: number;
  data: Data;
}

export class ReturnValueWithPagination<Data = unknown> {
  constructor(
    success: boolean,
    message?: string,
    data?: PaginationData<Data>,
    error?: AppError
  ) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.error = error;
  }

  success: boolean;
  message?: string;
  data?: PaginationData<Data>;
  error?: AppError;
}
