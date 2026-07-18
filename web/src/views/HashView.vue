<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  useMessage,
} from 'naive-ui';
import { useHash } from '@/composables/useHash';
import { useHistory } from '@/composables/useHistory';
import { useResponsive } from '@/composables/useResponsive';
import { usePersistedRef } from '@/composables/usePersistedRef';
import ApiDocModal from '@/components/ApiDocModal.vue';
import ResultDisplay from '@/components/ResultDisplay.vue';
import PageHeader from '@/components/PageHeader.vue';
import TabRadioGroup from '@/components/TabRadioGroup.vue';
import type { HashAlgorithm } from '@/types';

const { t } = useI18n();
const message = useMessage();
const { result, error, calculate } = useHash();
const { recordUsage } = useHistory();
const { isMobile, formLabelWidth } = useResponsive();
const labelWidth = formLabelWidth('hash.algorithm');

const algorithm = usePersistedRef<HashAlgorithm>('devkitly-hash-algorithm', 'sha256');
const text = usePersistedRef<string>('devkitly-hash-text', '');

const algorithmOptions = [
  { label: 'MD5', value: 'md5' },
  { label: 'SHA-256', value: 'sha256' },
];

function handleCalculate() {
  calculate(algorithm.value, text.value);
  if (error.value) {
    message.warning(t(`hash.${error.value}`));
  } else {
    recordUsage('digest');
  }
}
</script>

<template>
  <div class="page-view">
    <div class="page-header-row">
      <PageHeader :title="t('hash.title')" :description="t('hash.description')" />
      <ApiDocModal feature-id="digest" />
    </div>

    <NCard class="form-card">
      <NForm :label-placement="isMobile ? 'top' : 'left'" :label-width="labelWidth">
        <NFormItem :label="t('hash.algorithm')">
          <TabRadioGroup v-model="algorithm" :options="algorithmOptions" :aria-label="t('hash.algorithm')" />
        </NFormItem>
        <NFormItem :label="t('hash.text')">
          <NInput
            v-model:value="text"
            type="textarea"
            :placeholder="t('hash.textPlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }"
          />
        </NFormItem>
        <NFormItem label=" ">
          <NButton type="primary" :class="{ 'mobile-btn': isMobile }" @click="handleCalculate">
            {{ t('common.calculate') }}
          </NButton>
        </NFormItem>
      </NForm>
    </NCard>

    <ResultDisplay v-if="result" :result="result" />
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

.mobile-btn {
  width: 100%;
}
</style>
