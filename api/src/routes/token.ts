import { Router } from 'express';
import { generateTokens } from '../services/token.js';
import { success, error } from '../utils/response.js';
import { ErrorCodes } from '../types/index.js';

const router: Router = Router();

router.post('/', (req, res) => {
  try {
    const { prefix, length, count } = req.body;

    const tokens = generateTokens({ prefix, length, count });
    res.json(success({ tokens }, req.lang));
  } catch (e: any) {
    res.json(error(ErrorCodes.PARAM_ERROR, 'paramError', req.lang));
  }
});

export default router;
