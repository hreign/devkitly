import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { darkTheme } from 'naive-ui';
import { lightThemeOverrides } from '@/theme/light';
import { darkThemeOverrides } from '@/theme/dark';

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref<boolean>(
    localStorage.getItem('devkitly-theme') === 'dark',
  );

  // 初始化时同步 data-theme 属性
  if (isDark.value) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  const naiveTheme = computed(() => (isDark.value ? darkTheme : null));

  const naiveThemeOverrides = computed(() =>
    isDark.value ? darkThemeOverrides : lightThemeOverrides,
  );

  function toggleTheme() {
    isDark.value = !isDark.value;
    localStorage.setItem('devkitly-theme', isDark.value ? 'dark' : 'light');
    document.documentElement.setAttribute(
      'data-theme',
      isDark.value ? 'dark' : 'light',
    );
  }

  return { isDark, naiveTheme, naiveThemeOverrides, toggleTheme };
});
