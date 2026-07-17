import { createI18n } from 'vue-i18n';

// 自动扫描当前目录下的 .json 文件，文件名即语言代码
const localeModules = import.meta.glob('./*.json', { eager: true });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const messages: Record<string, any> = {};
const locales: string[] = [];

for (const path of Object.keys(localeModules)) {
  const lang = path.match(/\.\/(.+)\.json$/)?.[1];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const mod = localeModules[path] as { default?: any };
  if (lang && mod.default) {
    messages[lang] = mod.default;
    locales.push(lang);
  }
}

const defaultLocale = locales.includes('zh-cn') ? 'zh-cn' : locales[0];

function getInitialLocale(): string {
  const stored = localStorage.getItem('devkitly-locale');
  if (stored && locales.includes(stored)) return stored;
  const browserLang = navigator.language.toLowerCase();
  // 尝试匹配浏览器语言
  for (const loc of locales) {
    if (browserLang.startsWith(loc) || loc.startsWith(browserLang)) return loc;
    // 匹配语言部分（如浏览器 zh 匹配 zh-cn）
    const langPart = loc.split('-')[0];
    if (browserLang.startsWith(langPart)) return loc;
  }
  return defaultLocale;
}

const i18n = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  fallbackLocale: defaultLocale,
  messages,
});

export default i18n;
export { locales };
