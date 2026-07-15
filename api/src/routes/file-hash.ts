import { Router } from 'express';
import multer from 'multer';
import { calculateFileHash } from '../services/file-hash.js';
import { success, error } from '../utils/response.js';
import { ErrorCodes } from '../types/index.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const algorithm = req.body.algorithm;

    if (!file) {
      res.json(error(ErrorCodes.PARAM_ERROR, '缺少文件'));
      return;
    }

    if (!algorithm || (algorithm !== 'md5' && algorithm !== 'sha256')) {
      res.json(error(ErrorCodes.UNSUPPORTED_TYPE, '不支持的算法'));
      return;
    }

    // 使用流式处理（从 buffer 创建可读流）
    const { Readable } = await import('stream');
    const stream = Readable.from(file.buffer);

    const hash = await calculateFileHash(stream, file.size, algorithm);
    res.json(success({ hash }));
  } catch (e: any) {
    if (e.message?.includes('文件大小')) {
      res.json(error(ErrorCodes.PARAM_ERROR, e.message));
    } else {
      res.json(error(ErrorCodes.FILE_IO_ERROR, '文件读写异常'));
    }
  }
});

export default router;
