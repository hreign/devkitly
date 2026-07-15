import crypto from 'crypto';
import type { HashAlgorithm } from '../types/index.js';

export function calculateHash(algorithm: HashAlgorithm, text: string): string {
  if (!text) throw new Error('缺少 text 参数');

  const algo = algorithm === 'md5' ? 'md5' : 'sha256';
  return crypto.createHash(algo).update(text).digest('hex');
}
