// QR 码类型
export type QrType = 'text' | 'wifi';
export type WifiEncryption = 'WPA' | 'WEP' | 'nopass';

// UUID 版本
export type UuidVersion = 'v4' | 'v5';

// 散列算法
export type HashAlgorithm = 'md5' | 'sha256';

// 编码格式
export type CodecFormat = 'base64' | 'hex' | 'utf8' | 'unicode' | 'url';

// API 统一响应
export interface ApiResponse<T = unknown> {
  code: number;
  msg: string;
  data: T | null;
}

// 错误码
export const ErrorCodes = {
  SUCCESS: 0,
  PARAM_ERROR: 1000,
  UNSUPPORTED_TYPE: 1001,
  FILE_IO_ERROR: 2000,
  UNAUTHORIZED: 4001,
} as const;

// 扩展 Express Request 类型
declare global {
  namespace Express {
    interface Request {
      lang?: string;
    }
  }
}
