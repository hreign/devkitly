import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLocaleStore = defineStore('locale', () => {
  const locale = ref<string>(
    localStorage.getItem('devkitly-locale') ||
      (navigator.language.toLowerCase().startsWith('zh') ? 'zh-cn' : 'en-us'),
  );

  function setLocale(newLocale: string) {
    locale.value = newLocale;
    localStorage.setItem('devkitly-locale', newLocale);
  }

  return { locale, setLocale };
});
