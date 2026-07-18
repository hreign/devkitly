import crypto from 'crypto';
import type { RsaKeySize } from '../types/index.js';

export function generateRsaKeyPair(keySize: RsaKeySize): { publicKey: string; privateKey: string } {
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: keySize,
    publicKeyEncoding: { type: 'spki', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
  });
  return { publicKey, privateKey };
}

export function rsaEncrypt(publicKeyPem: string, plaintext: string): string {
  const publicKey = crypto.createPublicKey({ key: publicKeyPem, format: 'pem', type: 'spki' });
  const encrypted = crypto.publicEncrypt(
    { key: publicKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
    Buffer.from(plaintext, 'utf8'),
  );
  return encrypted.toString('base64');
}

export function rsaDecrypt(privateKeyPem: string, ciphertext: string): string {
  const privateKey = crypto.createPrivateKey({ key: privateKeyPem, format: 'pem', type: 'pkcs8' });
  const decrypted = crypto.privateDecrypt(
    { key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: 'sha256' },
    Buffer.from(ciphertext, 'base64'),
  );
  return decrypted.toString('utf8');
}
