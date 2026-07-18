import { Router } from 'express';
import multer from 'multer';
import { generateQrCode } from '../services/qr.js';
import { success, error } from '../utils/response.js';
import { ErrorCodes } from '../types/index.js';

const upload = multer({ storage: multer.memoryStorage() });
const router: Router = Router();

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { type, content, ssid, password, encryption } = req.body;

    if (!type || (type !== 'text' && type !== 'wifi' && type !== 'image')) {
      res.json(error(ErrorCodes.UNSUPPORTED_TYPE, 'unsupportedType', req.lang));
      return;
    }

    if (type === 'image') {
      const file = req.file;
      if (!file) {
        res.json(error(ErrorCodes.PARAM_ERROR, 'missingImage', req.lang));
        return;
      }
      const image = await generateQrCode('image', {
        imageBuffer: file.buffer,
        imageMime: file.mimetype,
      });
      res.json(success({ image }, req.lang));
    } else {
      const image = await generateQrCode(type, { content, ssid, password, encryption });
      res.json(success({ image }, req.lang));
    }
  } catch (e: any) {
    res.json(error(ErrorCodes.PARAM_ERROR, 'paramError', req.lang));
  }
});

export default router;
