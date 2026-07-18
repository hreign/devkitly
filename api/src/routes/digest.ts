import { Router } from 'express';
import multer from 'multer';
import { calculateHash } from '../services/hash.js';
import { calculateFileHash } from '../services/file-hash.js';
import { success, error } from '../utils/response.js';
import { ErrorCodes } from '../types/index.js';
import { Readable } from 'stream';

const upload = multer({ storage: multer.memoryStorage() });
const router: Router = Router();

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const { inputType, algorithm, text } = req.body;

    if (!algorithm || (algorithm !== 'md5' && algorithm !== 'sha256')) {
      res.json(error(ErrorCodes.UNSUPPORTED_TYPE, 'unsupportedAlgorithm', req.lang));
      return;
    }

    if (inputType === 'text') {
      if (!text) {
        res.json(error(ErrorCodes.PARAM_ERROR, 'missingText', req.lang));
        return;
      }
      const hash = calculateHash(algorithm, text);
      res.json(success({ hash }, req.lang));
    } else if (inputType === 'file') {
      const file = req.file;
      if (!file) {
        res.json(error(ErrorCodes.PARAM_ERROR, 'missingFile', req.lang));
        return;
      }
      const stream = Readable.from(file.buffer);
      const hash = await calculateFileHash(stream, file.size, algorithm);
      res.json(success({ hash }, req.lang));
    } else {
      res.json(error(ErrorCodes.UNSUPPORTED_TYPE, 'unsupportedInputType', req.lang));
    }
  } catch {
    res.json(error(ErrorCodes.PARAM_ERROR, 'paramError', req.lang));
  }
});

export default router;
