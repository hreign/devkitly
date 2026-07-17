import type { Request, Response, NextFunction } from 'express';
import { error } from '../utils/response.js';
import { ErrorCodes } from '../types/index.js';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const password = process.env.PASSWORD;

  // 未配置 PASSWORD 环境变量，不鉴权
  if (!password) {
    next();
    return;
  }

  const apiPassword = req.headers['x-api-password'];

  if (!apiPassword || apiPassword !== password) {
    res.json(error(ErrorCodes.UNAUTHORIZED, 'unauthorized', req.lang));
    return;
  }

  next();
}
