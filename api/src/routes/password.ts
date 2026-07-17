import { Router } from 'express';
import { generatePassword } from '../services/password.js';
import { success, error } from '../utils/response.js';
import { ErrorCodes } from '../types/index.js';

const router: Router = Router();

router.post('/', (req, res) => {
  try {
    const { length, includeUpper, includeLower, includeNumber, includeSymbol, customSymbols } = req.body;

    const password = generatePassword({
      length,
      includeUpper,
      includeLower,
      includeNumber,
      includeSymbol,
      customSymbols,
    });
    res.json(success({ password }, req.lang));
  } catch (e: any) {
    res.json(error(ErrorCodes.PARAM_ERROR, 'paramError', req.lang));
  }
});

export default router;
