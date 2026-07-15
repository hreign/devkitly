import { ref } from 'vue';
import CryptoJS from 'crypto-js';
import type { HashAlgorithm } from '@/types';

export function useHash() {
  const result = ref<string>('');
  const error = ref<string>('');

  function calculate(algorithm: HashAlgorithm, text: string) {
    error.value = '';
    result.value = '';

    if (!text) {
      error.value = 'textRequired';
      return;
    }

    try {
      if (algorithm === 'md5') {
        result.value = CryptoJS.MD5(text).toString();
      } else {
        result.value = CryptoJS.SHA256(text).toString();
      }
    } catch {
      error.value = 'unknown';
    }
  }

  return { result, error, calculate };
}
