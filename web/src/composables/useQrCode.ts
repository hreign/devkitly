import { ref } from 'vue';
import QRCode from 'qrcode';
import type { QrType, WifiEncryption } from '@/types';

export function useQrCode() {
  const result = ref<string>('');
  const error = ref<string>('');

  async function generate(
    type: QrType,
    data: { content?: string; ssid?: string; password?: string; encryption?: WifiEncryption },
  ) {
    error.value = '';
    result.value = '';

    try {
      let text: string;
      if (type === 'text') {
        if (!data.content) throw new Error('contentRequired');
        if (data.content.length > 256) throw new Error('contentTooLong');
        text = data.content;
      } else {
        if (!data.ssid) throw new Error('ssidRequired');
        if (!data.password) throw new Error('wifiPasswordRequired');
        if (!data.encryption) throw new Error('encryptionRequired');
        text = `WIFI:T:${data.encryption};S:${data.ssid};P:${data.password};;`;
      }

      const dataUrl = await QRCode.toDataURL(text, {
        width: 256,
        margin: 2,
        errorCorrectionLevel: 'M',
      });
      // 提取 base64 部分
      result.value = dataUrl.split(',')[1] || dataUrl;
    } catch (e: any) {
      if (e.message && typeof e.message === 'string') {
        error.value = e.message;
      } else {
        error.value = 'unknown';
      }
    }
  }

  return { result, error, generate };
}
