import crypto from 'crypto';
import type { HashAlgorithm } from '../types/index.js';
import type { Readable } from 'stream';

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export async function calculateFileHash(
  fileStream: Readable,
  fileSize: number,
  algorithm: HashAlgorithm,
): Promise<string> {
  if (fileSize > MAX_FILE_SIZE) throw new Error('文件大小不能超过 100 MB');

  const algo = algorithm === 'md5' ? 'md5' : 'sha256';
  const hash = crypto.createHash(algo);

  return new Promise((resolve, reject) => {
    fileStream.on('data', (chunk: Buffer) => {
      hash.update(chunk);
    });
    fileStream.on('end', () => {
      resolve(hash.digest('hex'));
    });
    fileStream.on('error', (err: Error) => {
      reject(err);
    });
  });
}
