import { ref } from 'vue';
import type { AsymmetricMode, RsaKeySize } from '@/types';

export function useAsymmetric() {
  const mode = ref<AsymmetricMode>('generate');
  const keySize = ref<RsaKeySize>(2048);
  const publicKey = ref<string>('');
  const privateKey = ref<string>('');
  const ciphertext = ref<string>('');
  const plaintext = ref<string>('');
  const error = ref<string>('');
  const generating = ref(false);
  const processing = ref(false);

  function isWebCryptoAvailable(): boolean {
    return !!(window.crypto && window.crypto.subtle);
  }

  function arrayBufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  function base64ToArrayBuffer(base64: string): ArrayBuffer {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes.buffer;
  }

  function arrayBufferToPem(buffer: ArrayBuffer, label: string): string {
    const base64 = arrayBufferToBase64(buffer);
    const lines = base64.match(/.{1,64}/g) || [];
    return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----`;
  }

  function pemToArrayBuffer(pem: string): ArrayBuffer {
    const base64 = pem
      .replace(/-----BEGIN [^-]+-----/, '')
      .replace(/-----END [^-]+-----/, '')
      .replace(/\s/g, '');
    return base64ToArrayBuffer(base64);
  }

  async function importPublicKey(pem: string): Promise<CryptoKey> {
    const buffer = pemToArrayBuffer(pem);
    return window.crypto.subtle.importKey(
      'spki',
      buffer,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['encrypt'],
    );
  }

  async function importPrivateKey(pem: string): Promise<CryptoKey> {
    const buffer = pemToArrayBuffer(pem);
    return window.crypto.subtle.importKey(
      'pkcs8',
      buffer,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      false,
      ['decrypt'],
    );
  }

  async function generateKeyPair(size?: RsaKeySize): Promise<void> {
    if (!isWebCryptoAvailable()) {
      error.value = 'webCryptoUnsupported';
      return;
    }

    generating.value = true;
    error.value = '';
    publicKey.value = '';
    privateKey.value = '';

    try {
      const keyPair = await window.crypto.subtle.generateKey(
        {
          name: 'RSA-OAEP',
          modulusLength: size || keySize.value,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: 'SHA-256',
        },
        true,
        ['encrypt', 'decrypt'],
      );

      const publicKeyBuffer = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
      publicKey.value = arrayBufferToPem(publicKeyBuffer, 'PUBLIC KEY');

      const privateKeyBuffer = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
      privateKey.value = arrayBufferToPem(privateKeyBuffer, 'PRIVATE KEY');
    } catch {
      error.value = 'generateKeyFailed';
    } finally {
      generating.value = false;
    }
  }

  async function encryptWithPublicKey(pubKeyPem: string, plainText: string): Promise<void> {
    if (!isWebCryptoAvailable()) {
      error.value = 'webCryptoUnsupported';
      return;
    }

    processing.value = true;
    error.value = '';
    ciphertext.value = '';

    try {
      if (!pubKeyPem) throw new Error('publicKeyRequired');
      if (!plainText) throw new Error('plaintextRequired');

      const pubKey = await importPublicKey(pubKeyPem);
      const encoder = new TextEncoder();
      const encoded = encoder.encode(plainText);
      const encrypted = await window.crypto.subtle.encrypt(
        { name: 'RSA-OAEP' },
        pubKey,
        encoded,
      );

      ciphertext.value = arrayBufferToBase64(encrypted);
    } catch (e: any) {
      if (e.message === 'publicKeyRequired' || e.message === 'plaintextRequired') {
        error.value = e.message;
      } else if (e.name === 'DataError') {
        error.value = 'invalidPublicKey';
      } else if (e.name === 'OperationError') {
        error.value = 'plaintextTooLong';
      } else {
        error.value = 'encryptFailed';
      }
    } finally {
      processing.value = false;
    }
  }

  async function decryptWithPrivateKey(privKeyPem: string, cipherText: string): Promise<void> {
    if (!isWebCryptoAvailable()) {
      error.value = 'webCryptoUnsupported';
      return;
    }

    processing.value = true;
    error.value = '';
    plaintext.value = '';

    try {
      if (!privKeyPem) throw new Error('privateKeyRequired');
      if (!cipherText) throw new Error('ciphertextRequired');

      const privKey = await importPrivateKey(privKeyPem);
      const encrypted = base64ToArrayBuffer(cipherText);
      const decrypted = await window.crypto.subtle.decrypt(
        { name: 'RSA-OAEP' },
        privKey,
        encrypted,
      );

      const decoder = new TextDecoder();
      plaintext.value = decoder.decode(decrypted);
    } catch (e: any) {
      if (e.message === 'privateKeyRequired' || e.message === 'ciphertextRequired') {
        error.value = e.message;
      } else if (e.name === 'DataError') {
        error.value = 'invalidPrivateKey';
      } else {
        error.value = 'decryptFailed';
      }
    } finally {
      processing.value = false;
    }
  }

  return {
    mode,
    keySize,
    publicKey,
    privateKey,
    ciphertext,
    plaintext,
    error,
    generating,
    processing,
    isWebCryptoAvailable,
    generateKeyPair,
    encryptWithPublicKey,
    decryptWithPrivateKey,
  };
}
