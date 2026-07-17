import type { Request, Response, NextFunction } from 'express';
import '../types/index.js';
import { resolveLang } from '../i18n/index.js';

export function i18nMiddleware(req: Request, _res: Response, next: NextFunction) {
  const rawLang = req.headers['x-api-lang'];
  req.lang = resolveLang(typeof rawLang === 'string' ? rawLang : undefined);
  next();
}
