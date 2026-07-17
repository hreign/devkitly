import { ref, watch, type Ref } from 'vue';

/**
 * 创建一个自动持久化到 localStorage 的响应式 ref
 * @param key localStorage 存储键
 * @param defaultValue 默认值
 * @returns 响应式 ref，值变化时自动同步到 localStorage
 */
export function usePersistedRef<T>(key: string, defaultValue: T): Ref<T> {
  const stored = localStorage.getItem(key);
  const initialValue = stored !== null ? (JSON.parse(stored) as T) : defaultValue;

  const data = ref<T>(initialValue) as Ref<T>;

  watch(
    data,
    (val) => {
      localStorage.setItem(key, JSON.stringify(val));
    },
    { deep: true },
  );

  return data;
}
