import { ref, computed } from 'vue';
import { useHash } from './useHash';
import { useFileHash } from './useFileHash';
import type { DigestInputType, HashAlgorithm } from '@/types';

export function useDigest() {
  const inputType = ref<DigestInputType>('text');
  const algorithm = ref<HashAlgorithm>('sha256');

  const { result: textResult, error: textError, calculate: calculateText } = useHash();
  const { result: fileResult, error: fileError, calculating, progress, calculate: calculateFile } = useFileHash();

  const result = computed(() => inputType.value === 'text' ? textResult.value : fileResult.value);
  const error = computed(() => inputType.value === 'text' ? textError.value : fileError.value);

  function calculateTextHash(text: string) {
    calculateText(algorithm.value, text);
  }

  function calculateFileHash(file: File) {
    calculateFile(file, algorithm.value);
  }

  return {
    inputType,
    algorithm,
    result,
    error,
    calculating,
    progress,
    calculateTextHash,
    calculateFileHash,
  };
}
