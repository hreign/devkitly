// 功能标识
export type FeatureId =
  | 'qr'
  | 'uuid'
  | 'password'
  | 'digest'
  | 'codec'
  | 'token'
  | 'asymmetric';

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

// 摘要输入类型
export type DigestInputType = 'text' | 'file';

// 非对称加密操作模式
export type AsymmetricMode = 'generate' | 'encrypt' | 'decrypt';

// RSA 密钥长度
export type RsaKeySize = 2048 | 4096;

// UUID 版本
export type UuidVersion = 'v4' | 'v5';

// 散列算法
export type HashAlgorithm = 'md5' | 'sha256';

// 编码格式
export type CodecFormat = 'base64' | 'hex' | 'utf8' | 'unicode' | 'url';
