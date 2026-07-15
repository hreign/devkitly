import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { darkTheme } from 'naive-ui';

export const useThemeStore = defineStore('theme', () => {
  const isDark = ref<boolean>(
    localStorage.getItem('devkitly-theme') === 'dark',
  );

  const naiveTheme = computed(() => (isDark.value ? darkTheme : null));

  function toggleTheme() {
    isDark.value = !isDark.value;
    localStorage.setItem('devkitly-theme', isDark.value ? 'dark' : 'light');
  }

  return { isDark, naiveTheme, toggleTheme };
});
