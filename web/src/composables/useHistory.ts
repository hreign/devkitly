import type { FeatureId, UsageHistory } from '@/types';

const STORAGE_KEY = 'devkitly-history';
const MAX_RECORDS = 500;

// 旧 FeatureId 到新 FeatureId 的映射
const LEGACY_FEATURE_MAP: Partial<Record<string, FeatureId>> = {
  'hash': 'digest',
  'file-hash': 'digest',
};

function mapFeatureId(id: string): FeatureId {
  return (LEGACY_FEATURE_MAP[id] as FeatureId) || (id as FeatureId);
}

function isLocalStorageAvailable(): boolean {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, '1');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function loadHistory(): UsageHistory {
  if (!isLocalStorageAvailable()) return { records: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { records: [] };
    return JSON.parse(raw) as UsageHistory;
  } catch {
    return { records: [] };
  }
}

function saveHistory(history: UsageHistory): void {
  if (!isLocalStorageAvailable()) return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  } catch {
    // 存储满或不可用时静默失败
  }
}

export function useHistory() {
  function recordUsage(featureId: FeatureId): void {
    const history = loadHistory();
    history.records.push({ featureId, timestamp: Date.now() });
    // 限制记录数量
    if (history.records.length > MAX_RECORDS) {
      history.records = history.records.slice(-MAX_RECORDS);
    }
    saveHistory(history);
  }

  function getRecentUsage(n: number): FeatureId[] {
    const history = loadHistory();
    const seen = new Set<FeatureId>();
    const result: FeatureId[] = [];
    for (let i = history.records.length - 1; i >= 0; i--) {
      const id = mapFeatureId(history.records[i].featureId);
      if (!seen.has(id)) {
        seen.add(id);
        result.push(id);
        if (result.length >= n) break;
      }
    }
    return result;
  }

  function getFrequentUsage(n: number): FeatureId[] {
    const history = loadHistory();
    const countMap = new Map<FeatureId, number>();
    for (const record of history.records) {
      const id = mapFeatureId(record.featureId);
      countMap.set(id, (countMap.get(id) || 0) + 1);
    }
    return Array.from(countMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, n)
      .map(([id]) => id);
  }

  return { recordUsage, getRecentUsage, getFrequentUsage };
}
