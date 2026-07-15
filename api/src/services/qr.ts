import QRCode from 'qrcode';
import type { QrType, WifiEncryption } from '../types/index.js';

export async function generateQrCode(
  type: QrType,
  data: { content?: string; ssid?: string; password?: string; encryption?: WifiEncryption },
): Promise<string> {
  let text: string;

  if (type === 'text') {
    if (!data.content) throw new Error('缺少 content 参数');
    if (data.content.length > 256) throw new Error('content 不能超过 256 字符');
    text = data.content;
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
