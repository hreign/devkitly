import crypto from 'crypto';

const TOKEN_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function generateTokens(options: {
  prefix?: string;
  length?: number;
  count?: number;
}): string[] {
  const { prefix = '', length = 32, count = 1 } = options;

  if (prefix.length > 16) throw new Error('prefix 不能超过 16 字符');
  if (length < 1 || length > 256) throw new Error('length 范围为 1-256');
  if (count < 1 || count > 100) throw new Error('count 范围为 1-100');

  const tokens: string[] = [];
  for (let i = 0; i < count; i++) {
    let token = prefix;
    const remaining = length - prefix.length;
    for (let j = 0; j < remaining; j++) {
      token += TOKEN_CHARS[crypto.randomInt(TOKEN_CHARS.length)];
    }
    tokens.push(token);
  }

  return tokens;
}
