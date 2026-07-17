import { Router } from 'express';
import multer from 'multer';
import { calculateFileHash } from '../services/file-hash.js';
import { success, error } from '../utils/response.js';
import { ErrorCodes } from '../types/index.js';

const upload = multer({ storage: multer.memoryStorage() });
const router: Router = Router();

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const algorithm = req.body.algorithm;

    if (!file) {
      res.json(error(ErrorCodes.PARAM_ERROR, 'missingFile', req.lang));
      return;
    }

    if (!algorithm || (algorithm !== 'md5' && algorithm !== 'sha256')) {
      res.json(error(ErrorCodes.UNSUPPORTED_TYPE, 'unsupportedAlgorithm', req.lang));
      return;
    }

    // 使用流式处理（从 buffer 创建可读流）
    const { Readable } = await import('stream');
    const stream = Readable.from(file.buffer);

    const hash = await calculateFileHash(stream, file.size, algorithm);
    res.json(success({ hash }, req.lang));
  } catch (e: any) {
    if (e.message?.includes('文件大小')) {
      res.json(error(ErrorCodes.PARAM_ERROR, 'paramError', req.lang));
    } else {
      res.json(error(ErrorCodes.FILE_IO_ERROR, 'fileIoError', req.lang));
    }
  }
});

export default router;
