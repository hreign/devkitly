import { v4 as uuidv4, v5 as uuidv5 } from 'uuid';
import type { UuidVersion } from '../types/index.js';

const NAMESPACES: Record<string, string> = {
  dns: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
  url: '6ba7b811-9dad-11d1-80b4-00c04fd430c8',
  oid: '6ba7b812-9dad-11d1-80b4-00c04fd430c8',
  x500: '6ba7b814-9dad-11d1-80b4-00c04fd430c8',
};

export function generateUuids(
  version: UuidVersion,
  count: number,
  namespace?: string,
  name?: string,
): string[] {
  if (count < 1 || count > 100) throw new Error('count 范围为 1-100');

  if (version === 'v5') {
    if (!namespace) throw new Error('v5 需要提供 namespace');
    if (!name) throw new Error('v5 需要提供 name');
  }

  const uuids: string[] = [];
  for (let i = 0; i < count; i++) {
    if (version === 'v4') {
      uuids.push(uuidv4());
    } else {
      const ns = NAMESPACES[namespace!.toLowerCase()] || namespace!;
      uuids.push(uuidv5(name!, ns));
    }
  }

  return uuids;
}
