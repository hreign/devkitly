import { Router } from 'express';
import { generateUuids } from '../services/uuid.js';
import { success, error } from '../utils/response.js';
import { ErrorCodes } from '../types/index.js';

const router: Router = Router();

router.post('/', (req, res) => {
  try {
    const { version, count, namespace, name } = req.body;

    if (!version || (version !== 'v4' && version !== 'v5')) {
      res.json(error(ErrorCodes.UNSUPPORTED_TYPE, 'unsupportedType', req.lang));
      return;
    }

    const uuids = generateUuids(version, count, namespace, name);
    res.json(success({ uuids }, req.lang));
  } catch (e: any) {
    res.json(error(ErrorCodes.PARAM_ERROR, 'paramError', req.lang));
  }
});

export default router;
