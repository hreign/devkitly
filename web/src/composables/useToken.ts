import { ref } from 'vue';

const TOKEN_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export function useToken() {
  const result = ref<string[]>([]);
  const error = ref<string>('');

  function generate(options: { prefix?: string; length?: number; count?: number }) {
    error.value = '';
    result.value = [];

    const { prefix = '', length = 32, count = 1 } = options;

    if (prefix.length > 16) {
      error.value = 'prefixTooLong';
      return;
    }

    if (length < 1 || length > 256) {
      error.value = 'lengthRange';
      return;
    }

    if (count < 1 || count > 100) {
      error.value = 'countRange';
      return;
    }

    const tokens: string[] = [];
    for (let i = 0; i < count; i++) {
      let token = prefix;
      const remaining = length - prefix.length;
      for (let j = 0; j < remaining; j++) {
        token += TOKEN_CHARS[Math.floor(Math.random() * TOKEN_CHARS.length)];
      }
      tokens.push(token);
    }

    result.value = tokens;
  }

  return { result, error, generate };
}
