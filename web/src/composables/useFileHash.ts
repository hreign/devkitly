import { ref } from 'vue';
import SparkMD5 from 'spark-md5';
import CryptoJS from 'crypto-js';
import type { HashAlgorithm } from '@/types';

const CHUNK_SIZE = 2 * 1024 * 1024; // 2MB 分片
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export function useFileHash() {
  const result = ref<string>('');
  const error = ref<string>('');
  const calculating = ref(false);
  const progress = ref(0);

  async function calculate(file: File, algorithm: HashAlgorithm) {
    error.value = '';
    result.value = '';
    progress.value = 0;

    if (!file) {
      error.value = 'fileRequired';
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      error.value = 'fileSizeLimit';
      return;
    }

    calculating.value = true;

    try {
      if (algorithm === 'md5') {
        result.value = await calculateMD5(file);
      } else {
        result.value = await calculateSHA256(file);
      }
    } catch {
      error.value = 'unknown';
    } finally {
      calculating.value = false;
      progress.value = 100;
    }
  }

  function calculateMD5(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const spark = new SparkMD5.ArrayBuffer();
      const reader = new FileReader();
      const chunks = Math.ceil(file.size / CHUNK_SIZE);
      let currentChunk = 0;

      reader.onload = (e) => {
        if (e.target?.result) {
          spark.append(e.target.result as ArrayBuffer);
          currentChunk++;
          progress.value = Math.round((currentChunk / chunks) * 100);

          if (currentChunk < chunks) {
            loadNext();
          } else {
            resolve(spark.end());
          }
        }
      };

      reader.onerror = () => reject(new Error('读取文件失败'));

      function loadNext() {
        const start = currentChunk * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        reader.readAsArrayBuffer(file.slice(start, end));
      }

      loadNext();
    });
  }

  function calculateSHA256(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      let hashObj = CryptoJS.algo.SHA256.create();
      const chunks = Math.ceil(file.size / CHUNK_SIZE);
      let currentChunk = 0;

      reader.onload = (e) => {
        if (e.target?.result) {
          const wordArray = CryptoJS.lib.WordArray.create(e.target.result as ArrayBuffer);
          hashObj.update(wordArray);
          currentChunk++;
          progress.value = Math.round((currentChunk / chunks) * 100);

          if (currentChunk < chunks) {
            loadNext();
          } else {
            resolve(hashObj.finalize().toString());
          }
        }
      };

      reader.onerror = () => reject(new Error('读取文件失败'));

      function loadNext() {
        const start = currentChunk * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        reader.readAsArrayBuffer(file.slice(start, end));
      }

      loadNext();
    });
  }

  return { result, error, calculating, progress, calculate };
}
