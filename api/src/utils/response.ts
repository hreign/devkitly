import type { ApiResponse } from '../types/index.js';
import { ErrorCodes } from '../types/index.js';

export function success<T>(data: T): ApiResponse<T> {
  return { code: ErrorCodes.SUCCESS, msg: '成功', data };
}

export function error(code: number, msg: string): ApiResponse<null> {
  return { code, msg, data: null };
}
