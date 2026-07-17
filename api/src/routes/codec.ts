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
      res.json(error(ErrorCodes.UNSUPPORTED_TYPE, 'unsupportedSourceFormat', req.lang));
      return;
    }
    if (!to || !VALID_FORMATS.includes(to)) {
      res.json(error(ErrorCodes.UNSUPPORTED_TYPE, 'unsupportedTargetFormat', req.lang));
      return;
    }

    const result = convertCodec(from, to, text);
    res.json(success({ result }, req.lang));
  } catch (e: any) {
    res.json(error(ErrorCodes.PARAM_ERROR, 'paramError', req.lang));
  }
});

export default router;
