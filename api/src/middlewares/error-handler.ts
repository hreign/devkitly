import type { Request, Response, NextFunction } from 'express';
import { error } from '../utils/response.js';
import { ErrorCodes } from '../types/index.js';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction) {
  console.error('服务端错误:', err.message);
  res.json(error(ErrorCodes.PARAM_ERROR, '服务端内部错误'));
}
