import { Router } from 'express';
import {
  generateRsaKeyPair,
  rsaEncrypt,
  rsaDecrypt,
} from '../services/asymmetric.js';
import { success, error } from '../utils/response.js';
import { ErrorCodes } from '../types/index.js';

const router: Router = Router();

router.post('/', async (req, res) => {
  try {
    const { mode, keySize, publicKey, plaintext, privateKey, ciphertext } = req.body;

    if (!mode || (mode !== 'generate' && mode !== 'encrypt' && mode !== 'decrypt')) {
      res.json(error(ErrorCodes.UNSUPPORTED_TYPE, 'unsupportedMode', req.lang));
      return;
    }

    if (mode === 'generate') {
      const size = keySize === 4096 ? 4096 : 2048;
      const keyPair = generateRsaKeyPair(size);
      res.json(success(keyPair, req.lang));
    } else if (mode === 'encrypt') {
      if (!publicKey) {
        res.json(error(ErrorCodes.PARAM_ERROR, 'missingPublicKey', req.lang));
        return;
      }
      if (!plaintext) {
        res.json(error(ErrorCodes.PARAM_ERROR, 'missingPlaintext', req.lang));
        return;
      }
      const result = rsaEncrypt(publicKey, plaintext);
      res.json(success({ ciphertext: result }, req.lang));
    } else {
      if (!privateKey) {
        res.json(error(ErrorCodes.PARAM_ERROR, 'missingPrivateKey', req.lang));
        return;
      }
      if (!ciphertext) {
        res.json(error(ErrorCodes.PARAM_ERROR, 'missingCiphertext', req.lang));
        return;
      }
      const result = rsaDecrypt(privateKey, ciphertext);
      res.json(success({ plaintext: result }, req.lang));
    }
  } catch (e: any) {
    if (e.message?.includes('格式') || e.message?.includes('format') || e.message?.includes('PEM') || e.message?.includes('Failed')) {
      res.json(error(ErrorCodes.INVALID_FORMAT, 'invalidKeyFormat', req.lang));
    } else if (e.message?.includes('过长') || e.message?.includes('too long') || e.code === 'ERR_OSSL_RSA_DATA_TOO_LARGE') {
      res.json(error(ErrorCodes.DATA_TOO_LARGE, 'dataTooLarge', req.lang));
    } else if (e.message?.includes('解密失败') || e.message?.includes('decrypt') || e.code === 'ERR_OSSL_RSA_OAEP_DECODING_ERROR') {
      res.json(error(ErrorCodes.PARAM_ERROR, 'decryptFailed', req.lang));
    } else {
      res.json(error(ErrorCodes.PARAM_ERROR, 'paramError', req.lang));
    }
  }
});

export default router;
