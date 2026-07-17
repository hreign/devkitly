import crypto from 'crypto';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const DEFAULT_SYMBOLS = '!@#$%^&*()_+-=[]{}|;:\',.<>?';

export function generatePassword(options: {
  length: number;
  includeUpper: boolean;
  includeLower: boolean;
  includeNumber: boolean;
  includeSymbol: boolean;
  customSymbols?: string;
}): string {
  const { length, includeUpper, includeLower, includeNumber, includeSymbol, customSymbols } = options;

  if (length < 4 || length > 256) throw new Error('length 范围为 4-256');
  if (!includeUpper && !includeLower && !includeNumber && !includeSymbol) {
    throw new Error('至少选择一种字符类别');
  }

  let charset = '';
  const requiredChars: string[] = [];

  if (includeUpper) {
    charset += UPPER;
    requiredChars.push(randomChar(UPPER));
  }
  if (includeLower) {
    charset += LOWER;
    requiredChars.push(randomChar(LOWER));
  }
  if (includeNumber) {
    charset += NUMBERS;
    requiredChars.push(randomChar(NUMBERS));
  }
  if (includeSymbol) {
    const symbols = customSymbols || DEFAULT_SYMBOLS;
    charset += symbols;
    requiredChars.push(randomChar(symbols));
  }

  const remaining = length - requiredChars.length;
  const chars = [...requiredChars];

  for (let i = 0; i < remaining; i++) {
    chars.push(randomChar(charset));
  }

  // Fisher-Yates 洗牌
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }

  return chars.join('');
}

function randomChar(str: string): string {
  return str[crypto.randomInt(str.length)];
}
