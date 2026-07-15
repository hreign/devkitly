import { Router } from 'express';
import { convertCodec } from '../services/codec.js';
import { success, error } from '../utils/response.js';
import { ErrorCodes } from '../types/index.js';

const VALID_FORMATS = ['base64', 'hex', 'utf8', 'unicode', 'url'];

const router = Router();

router.post('/', (req, res) => {
  try {
    const { from, to, text } = req.body;

    if (!from || !VALID_FORMATS.includes(from)) {
      res.json(error(ErrorCodes.UNSUPPORTED_TYPE, '不支持的源格式'));
      return;
    }
    if (!to || !VALID_FORMATS.includes(to)) {
      res.json(error(ErrorCodes.UNSUPPORTED_TYPE, '不支持的目标格式'));
      return;
    }

    const result = convertCodec(from, to, text);
    res.json(success({ result }));
  } catch (e: any) {
    res.json(error(ErrorCodes.PARAM_ERROR, e.message || '参数错误'));
  }
});

export default router;
