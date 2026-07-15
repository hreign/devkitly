import { Router } from 'express';
import { generateTokens } from '../services/token.js';
import { success, error } from '../utils/response.js';
import { ErrorCodes } from '../types/index.js';

const router = Router();

router.post('/', (req, res) => {
  try {
    const { prefix, length, count } = req.body;

    const tokens = generateTokens({ prefix, length, count });
    res.json(success({ tokens }));
  } catch (e: any) {
    res.json(error(ErrorCodes.PARAM_ERROR, e.message || '参数错误'));
  }
});

export default router;
