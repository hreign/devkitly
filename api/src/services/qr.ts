import QRCode from 'qrcode';
import type { QrType, WifiEncryption } from '../types/index.js';

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/bmp'];
const MAX_IMAGE_SIZE = 2 * 1024 * 1024; // 2MB

export async function generateQrCode(
  type: QrType,
  data: { content?: string; ssid?: string; password?: string; encryption?: WifiEncryption; imageBuffer?: Buffer; imageMime?: string },
): Promise<string> {
  let text: string;

  if (type === 'text') {
    if (!data.content) throw new Error('缺少 content 参数');
    if (data.content.length > 256) throw new Error('content 不能超过 256 字符');
    text = data.content;
  } else if (type === 'image') {
    if (!data.imageBuffer) throw new Error('缺少图片文件');
    if (data.imageBuffer.length > MAX_IMAGE_SIZE) throw new Error('图片大小不能超过 2 MB');
    if (data.imageMime && !IMAGE_MIME_TYPES.includes(data.imageMime)) throw new Error('不支持的图片格式');
    const base64 = data.imageBuffer.toString('base64');
    const mime = data.imageMime || 'image/png';
    text = `data:${mime};base64,${base64}`;
  } else {
    if (!data.ssid) throw new Error('缺少 ssid 参数');
    if (!data.password) throw new Error('缺少 password 参数');
    if (!data.encryption) throw new Error('缺少 encryption 参数');
    text = `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};;`;
  }

  const dataUrl = await QRCode.toDataURL(text, {
    width: 256,
    margin: 2,
    errorCorrectionLevel: 'M',
  });

  return dataUrl.split(',')[1] || dataUrl;
}
