import { ref } from 'vue';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const DEFAULT_SYMBOLS = '!@#$%^&*()_+-=[]{}|;:\',.<>?';

export function usePassword() {
  const result = ref<string>('');
  const error = ref<string>('');

  function generate(options: {
    length: number;
    includeUpper: boolean;
    includeLower: boolean;
    includeNumber: boolean;
    includeSymbol: boolean;
    customSymbols?: string;
  }) {
    error.value = '';
    result.value = '';

    const { length, includeUpper, includeLower, includeNumber, includeSymbol, customSymbols } = options;

    if (length < 8 || length > 256) {
      error.value = 'lengthRange';
      return;
    }

    if (!includeUpper && !includeLower && !includeNumber && !includeSymbol) {
      error.value = 'atLeastOneCategory';
      return;
    }

    let charset = '';
    const requiredChars: string[] = [];

    if (includeUpper) {
      charset += UPPER;
      requiredChars.push(UPPER[Math.floor(Math.random() * UPPER.length)]);
    }
    if (includeLower) {
      charset += LOWER;
      requiredChars.push(LOWER[Math.floor(Math.random() * LOWER.length)]);
    }
    if (includeNumber) {
      charset += NUMBERS;
      requiredChars.push(NUMBERS[Math.floor(Math.random() * NUMBERS.length)]);
    }
    if (includeSymbol) {
      const symbols = customSymbols || DEFAULT_SYMBOLS;
      charset += symbols;
      requiredChars.push(symbols[Math.floor(Math.random() * symbols.length)]);
    }

    // 生成密码，确保至少包含每种勾选的字符类别
    const remaining = length - requiredChars.length;
    const chars: string[] = [...requiredChars];

    for (let i = 0; i < remaining; i++) {
      chars.push(charset[Math.floor(Math.random() * charset.length)]);
    }

    // Fisher-Yates 洗牌
    for (let i = chars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [chars[i], chars[j]] = [chars[j], chars[i]];
    }

    result.value = chars.join('');
  }

  return { result, error, generate };
}
