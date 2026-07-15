import { Router } from 'express';
import { calculateHash } from '../services/hash.js';
import { success, error } from '../utils/response.js';
import { ErrorCodes } from '../types/index.js';

const router = Router();

router.post('/', (req, res) => {
  try {
    const { algorithm, text } = req.body;

    if (!algorithm || (algorithm !== 'md5' && algorithm !== 'sha256')) {
      res.json(error(ErrorCodes.UNSUPPORTED_TYPE, '不支持的类型'));
      return;
    }

    const hash = calculateHash(algorithm, text);
    res.json(success({ hash }));
  } catch (e: any) {
    res.json(error(ErrorCodes.PARAM_ERROR, e.message || '参数错误'));
  }
});

export default router;
