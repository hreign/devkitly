// 功能标识
export type FeatureId =
  | 'qr'
  | 'uuid'
  | 'password'
  | 'hash'
  | 'codec'
  | 'file-hash'
  | 'token';

// 使用记录
interface UsageRecord {
  featureId: FeatureId;
  timestamp: number;
}

// 使用记录历史
export interface UsageHistory {
  records: UsageRecord[];
}

// QR 码类型
export type QrType = 'text' | 'wifi';
export type WifiEncryption = 'WPA' | 'WEP' | 'nopass';

// UUID 版本
export type UuidVersion = 'v4' | 'v5';

// 散列算法
export type HashAlgorithm = 'md5' | 'sha256';

// 编码格式
export type CodecFormat = 'base64' | 'hex' | 'utf8' | 'unicode' | 'url';
