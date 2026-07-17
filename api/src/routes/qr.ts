import { Router } from 'express';
import { generateQrCode } from '../services/qr.js';
import { success, error } from '../utils/response.js';
import { ErrorCodes } from '../types/index.js';

const router: Router = Router();

router.post('/', async (req, res) => {
  try {
    const { type, content, ssid, password, encryption } = req.body;

    if (!type || (type !== 'text' && type !== 'wifi')) {
      res.json(error(ErrorCodes.UNSUPPORTED_TYPE, 'unsupportedType', req.lang));
      return;
    }

    const image = await generateQrCode(type, { content, ssid, password, encryption });
    res.json(success({ image }, req.lang));
  } catch (e: any) {
    res.json(error(ErrorCodes.PARAM_ERROR, 'paramError', req.lang));
  }
});

export default router;
