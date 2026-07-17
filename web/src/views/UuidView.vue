<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NInputNumber,
  NButton,
  NIcon,
  useMessage,
} from 'naive-ui';
import { CopyOutline, CheckmarkOutline } from '@vicons/ionicons5';
import { useUuid } from '@/composables/useUuid';
import { useHistory } from '@/composables/useHistory';
import { useClipboard } from '@/utils/clipboard';
import { useResponsive } from '@/composables/useResponsive';
import { usePersistedRef } from '@/composables/usePersistedRef';
import ApiDocModal from '@/components/ApiDocModal.vue';
import PageHeader from '@/components/PageHeader.vue';
import type { UuidVersion } from '@/types';

const { t } = useI18n();
const message = useMessage();
const { result, error, generate } = useUuid();
const { recordUsage } = useHistory();
const { copyToClipboard } = useClipboard();
const { isMobile, formLabelWidth } = useResponsive();
const labelWidth = formLabelWidth('uuid.namespace');

const version = usePersistedRef<UuidVersion>('devkitly-uuid-version', 'v4');
const count = usePersistedRef<number>('devkitly-uuid-count', 1);
const namespace = usePersistedRef<string>('devkitly-uuid-namespace', '');
const name = usePersistedRef<string>('devkitly-uuid-name', '');

const copiedIndex = ref<number | null>(null);

const versionOptions = [
  { label: 'v4', value: 'v4' },
  { label: 'v5', value: 'v5' },
];

function handleGenerate() {
  generate(version.value, count.value, namespace.value, name.value);
  if (error.value) {
    message.warning(t(`uuid.${error.value}`));
  } else {
    recordUsage('uuid');
  }
}

function copyAll() {
  copyToClipboard(result.value.join('\n'));
}

async function copyItem(uuid: string, index: number) {
  await copyToClipboard(uuid);
  copiedIndex.value = index;
  setTimeout(() => {
    copiedIndex.value = null;
  }, 2000);
}
</script>

<template>
  <div class="page-view">
    <div class="page-header-row">
      <PageHeader :title="t('uuid.title')" :description="t('uuid.description')" />
      <ApiDocModal feature-id="uuid" />
    </div>

    <NCard class="form-card">
      <NForm :label-placement="isMobile ? 'top' : 'left'" :label-width="labelWidth">
        <NFormItem :label="t('uuid.version')">
          <NSelect v-model:value="version" :options="versionOptions" />
        </NFormItem>
        <template v-if="version === 'v5'">
          <NFormItem :label="t('uuid.namespace')">
            <NInput v-model:value="namespace" :placeholder="t('uuid.namespacePlaceholder')" />
          </NFormItem>
          <NFormItem :label="t('uuid.name')">
            <NInput v-model:value="name" :placeholder="t('uuid.namePlaceholder')" />
          </NFormItem>
        </template>
        <NFormItem :label="t('uuid.count')">
          <NInputNumber v-model:value="count" :min="1" :max="100" style="width: 100%;" />
        </NFormItem>
        <NFormItem label=" ">
          <NButton type="primary" :class="{ 'mobile-btn': isMobile }" @click="handleGenerate">
            {{ t('common.generate') }}
          </NButton>
        </NFormItem>
      </NForm>
    </NCard>

    <Transition name="result">
      <div v-if="result.length > 0" class="result-area">
        <div class="result-header">
          <div class="result-label">
            <span class="result-bar" />
            <span class="result-title">{{ t('common.result') }}</span>
          </div>
          <NButton text type="primary" class="interactive" :aria-label="t('common.copy')" @click="copyAll">
            {{ t('common.copy') }}
          </NButton>
        </div>
        <div class="uuid-list">
          <div
            v-for="(uuid, index) in result"
            :key="index"
            class="uuid-item interactive"
          >
            <code class="uuid-code">{{ uuid }}</code>
            <NButton
              text
              size="small"
              type="primary"
              class="interactive"
              :aria-label="copiedIndex === index ? t('common.copied') : t('common.copy')"
              @click="copyItem(uuid, index)"
            >
              <template #icon>
                <NIcon size="16">
                  <CheckmarkOutline v-if="copiedIndex === index" />
                  <CopyOutline v-else />
                </NIcon>
              </template>
              {{ copiedIndex === index ? t('common.copied') : t('common.copy') }}
            </NButton>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.page-view {
  max-width: 700px;
  margin: 0 auto;
}

.page-header-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.page-header-row :deep(.page-header) {
  margin-bottom: 0;
}

.form-card {
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.result-area {
  margin-top: var(--spacing-lg);
  background-color: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md) var(--spacing-lg);
  box-shadow: var(--shadow-sm);
}

.result-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
}

.result-label {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.result-bar {
  width: 3px;
  height: 16px;
  border-radius: 2px;
  background-color: var(--color-cta);
  flex-shrink: 0;
}

.result-title {
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.uuid-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.uuid-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  background-color: var(--color-bg-card);
  transition: background 0.2s ease;
}

.uuid-item:hover {
  background-color: var(--color-bg-elevated);
}

.uuid-code {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-body-sm);
  word-break: break-all;
}

.mobile-btn {
  width: 100%;
}
</style>
