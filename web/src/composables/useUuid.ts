import { ref } from 'vue';
import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import type { UuidVersion } from '@/types';

// UUID v5 预定义命名空间
const NAMESPACES: Record<string, string> = {
  dns: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  url: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
  oid: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
  x500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
};

export function useUuid() {
  const result = ref<string[]>([]);
  const error = ref<string>('');

  function generate(
    version: UuidVersion,
    count: number,
    namespace?: string,
    name?: string,
  ) {
    error.value = '';
    result.value = [];

    if (count < 1 || count > 100) {
      error.value = 'countRange';
      return;
    }

    if (version === 'v5') {
      if (!namespace) {
        error.value = 'namespaceRequired';
        return;
      }
      if (!name) {
        error.value = 'nameRequired';
        return;
      }
    }

    try {
      const uuids: string[] = [];
      for (let i = 0; i < count; i++) {
        if (version === 'v4') {
          uuids.push(uuidv4());
        } else {
          // 尝试使用预定义命名空间，否则直接使用用户输入作为命名空间 UUID
          const ns = NAMESPACES[namespace!.toLowerCase()] || namespace!;
          uuids.push(uuidv5(name!, ns));
        }
      }
      result.value = uuids;
    } catch (e) {
      error.value = 'unknown';
    }
  }

  return { result, error, generate };
}
