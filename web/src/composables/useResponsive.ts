import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * 根据文本内容估算 label 所需宽度
 * 字符按1em计算，加上右侧间距
 */
function estimateLabelWidth(text: string): string {
  // 判断是否为 CJK 字符（中文、日文、韩文）
  const width = /[\u4e00-\u9fff\u3040-\u30ff\uac00-\ud7af]/.test(text)
    ? 1
    : 0.6;

  return Math.ceil(width * text.length + 1) + 'em';
}

export function useResponsive() {
  const isMobile = ref(window.innerWidth < 768);
  const isTablet = ref(window.innerWidth >= 768 && window.innerWidth < 1024);

  const { t } = useI18n();

  /**
   * 根据最长 label 的 i18n key 动态计算表单 label 宽度
   * @param labelKey 最长 label 对应的 i18n key
   */
  function formLabelWidth(labelKey: string) {
    return computed(() => {
      if (isMobile.value) return undefined;
      return estimateLabelWidth(t(labelKey));
    });
  }

  function handleResize() {
    isMobile.value = window.innerWidth < 768;
    isTablet.value = window.innerWidth >= 768 && window.innerWidth < 1024;
  }

  onMounted(() => window.addEventListener('resize', handleResize));
  onUnmounted(() => window.removeEventListener('resize', handleResize));

  return { isMobile, isTablet, formLabelWidth };
}
