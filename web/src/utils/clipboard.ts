import { useMessage } from 'naive-ui';
import { useI18n } from 'vue-i18n';

export function useClipboard() {
  const message = useMessage();
  const { t } = useI18n();

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      message.success(t('common.copied'));
    } catch {
      // 降级方案
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      message.success(t('common.copied'));
    }
  }

  return { copyToClipboard };
}
