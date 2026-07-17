import type { ApiResponse } from '../types/index.js';
import { ErrorCodes } from '../types/index.js';
import { getMsg } from '../i18n/index.js';

export function success<T>(data: T, lang?: string): ApiResponse<T> {
  return { code: ErrorCodes.SUCCESS, msg: getMsg('success', lang), data };
}

export function error(code: number, key: string, lang?: string): ApiResponse<null> {
  return { code, msg: getMsg(key, lang), data: null };
}
