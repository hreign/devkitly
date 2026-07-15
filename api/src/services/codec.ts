import type { CodecFormat } from '../types/index.js';

export function convertCodec(from: CodecFormat, to: CodecFormat, text: string): string {
  if (!text) throw new Error('缺少 text 参数');
  if (from === to) throw new Error('源格式与目标格式不能相同');

  // 先转为 UTF-8 字符串
  const utf8Text = toUtf8(text, from);
  // 再从 UTF-8 转为目标格式
  return fromUtf8(utf8Text, to);
}

function toUtf8(text: string, format: CodecFormat): string {
  switch (format) {
    case 'utf8':
      return text;
    case 'base64':
      return Buffer.from(text, 'base64').toString('utf-8');
    case 'hex':
      return Buffer.from(text, 'hex').toString('utf-8');
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

function fromUtf8(text: string, format: CodecFormat): string {
  switch (format) {
    case 'utf8':
      return text;
    case 'base64':
      return Buffer.from(text, 'utf-8').toString('base64');
    case 'hex':
      return Buffer.from(text, 'utf-8').toString('hex');
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
