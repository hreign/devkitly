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
  NSpace,
  useMessage,
} from 'naive-ui';
import { useUuid } from '@/composables/useUuid';
import { useHistory } from '@/composables/useHistory';
import { useClipboard } from '@/utils/clipboard';
import ApiDocModal from '@/components/ApiDocModal.vue';
import type { UuidVersion } from '@/types';

const { t } = useI18n();
const message = useMessage();
const { result, error, generate } = useUuid();
const { recordUsage } = useHistory();
const { copyToClipboard } = useClipboard();

const version = ref<UuidVersion>('v4');
const count = ref(1);
const namespace = ref('');
const name = ref('');

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
</script>

<template>
  <div class="page-view">
    <NCard :title="t('uuid.title')">
      <template #header-extra>
        <ApiDocModal feature-id="uuid" />
      </template>
      <NForm label-placement="left" label-width="auto">
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
        <NFormItem>
          <NSpace>
            <NButton type="primary" @click="handleGenerate">{{ t('common.generate') }}</NButton>
          </NSpace>
        </NFormItem>
      </NForm>
    </NCard>

    <NCard v-if="result.length > 0" :title="t('common.result')" size="small" style="margin-top: 16px;">
      <template #header-extra>
        <NButton text type="primary" @click="copyAll">{{ t('common.copy') }}</NButton>
      </template>
      <div class="uuid-list">
        <div v-for="(uuid, index) in result" :key="index" class="uuid-item">
          <code>{{ uuid }}</code>
          <NButton text size="small" type="primary" @click="copyToClipboard(uuid)">{{ t('common.copy') }}</NButton>
        </div>
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.page-view {
  max-width: 700px;
  margin: 0 auto;
}

.uuid-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.uuid-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--n-color-embedded);
}

.uuid-item code {
  font-size: 14px;
  word-break: break-all;
}
</style>
