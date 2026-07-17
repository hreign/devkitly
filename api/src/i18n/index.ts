import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// 自动扫描当前目录下的 .json 文件，文件名即语言代码
const messages: Record<string, Record<string, string>> = {};
const supportedLangs: string[] = [];

const files = fs.readdirSync(__dirname).filter((f) => f.endsWith('.json'));

for (const file of files) {
  const lang = path.basename(file, '.json');
  const content = fs.readFileSync(path.join(__dirname, file), 'utf-8');
  messages[lang] = JSON.parse(content);
  supportedLangs.push(lang);
}

const DEFAULT_LANG = 'zh-cn';

/**
 * 将用户传入的语言标识解析为已注册的语言代码
 * 仅支持完整的语言代码（如 zh-cn、en-us），不匹配部分代码
 */
export function resolveLang(rawLang?: string): string {
  if (!rawLang) return DEFAULT_LANG;
  const lower = rawLang.toLowerCase();
  return supportedLangs.includes(lower) ? lower : DEFAULT_LANG;
}

export function getMsg(key: string, lang?: string): string {
  const resolvedLang = resolveLang(lang);
  return messages[resolvedLang]?.[key] || messages[DEFAULT_LANG]?.[key] || key;
}

export { DEFAULT_LANG, supportedLangs };
