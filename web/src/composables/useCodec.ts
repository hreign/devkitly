import { ref } from 'vue';
import type { CodecFormat } from '@/types';

export function useCodec() {
  const result = ref<string>('');
  const error = ref<string>('');

  // 统一转换为 UTF-8 字符串的中间格式
  function toUtf8(text: string, format: CodecFormat): string {
    switch (format) {
      case 'utf8':
        return text;
      case 'base64':
        return decodeURIComponent(
          Array.from(atob(text))
            .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
            .join(''),
        );
      case 'hex': {
        const bytes: number[] = [];
        for (let i = 0; i < text.length; i += 2) {
          bytes.push(parseInt(text.substr(i, 2), 16));
        }
        return new TextDecoder().decode(new Uint8Array(bytes));
      }
      case 'unicode':
        return text.replace(/\\u([0-9a-fA-F]{4})/g, (_, code) =>
          String.fromCharCode(parseInt(code, 16)),
        );
      case 'url':
        return decodeURIComponent(text);
      default:
        return text;
    }
  }

  // 从 UTF-8 字符串转换为目标格式
  function fromUtf8(text: string, format: CodecFormat): string {
    switch (format) {
      case 'utf8':
        return text;
      case 'base64':
        return btoa(
          encodeURIComponent(text).replace(/%([0-9A-F]{2})/g, (_, p1) =>
            String.fromCharCode(parseInt(p1, 16)),
          ),
        );
      case 'hex': {
        const encoder = new TextEncoder();
        const bytes = encoder.encode(text);
        return Array.from(bytes)
          .map((b) => b.toString(16).padStart(2, '0'))
          .join('');
      }
      case 'unicode':
        return Array.from(text)
          .map((c) =>
            c.charCodeAt(0) > 127
              ? '\\u' + c.charCodeAt(0).toString(16).padStart(4, '0')
              : c,
          )
          .join('');
      case 'url':
        return encodeURIComponent(text);
      default:
        return text;
    }
  }

  function convert(from: CodecFormat, to: CodecFormat, text: string) {
    error.value = '';
    result.value = '';

    if (!text) {
      error.value = 'textRequired';
      return;
    }

    if (from === to) {
      error.value = 'sameFormat';
      return;
    }

    try {
      const utf8Text = toUtf8(text, from);
      result.value = fromUtf8(utf8Text, to);
    } catch {
      error.value = 'invalidInput';
    }
  }

  return { result, error, convert };
}
