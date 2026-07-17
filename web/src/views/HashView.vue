<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  useMessage,
} from 'naive-ui';
import { useHash } from '@/composables/useHash';
import { useHistory } from '@/composables/useHistory';
import { useResponsive } from '@/composables/useResponsive';
import ApiDocModal from '@/components/ApiDocModal.vue';
import ResultDisplay from '@/components/ResultDisplay.vue';
import PageHeader from '@/components/PageHeader.vue';
import type { HashAlgorithm } from '@/types';

const { t } = useI18n();
const message = useMessage();
const { result, error, calculate } = useHash();
const { recordUsage } = useHistory();
const { isMobile } = useResponsive();

const algorithm = ref<HashAlgorithm>('sha256');
const text = ref('');

const algorithmOptions = [
  { label: 'MD5', value: 'md5' },
  { label: 'SHA-256', value: 'sha256' },
];

function handleCalculate() {
  calculate(algorithm.value, text.value);
  if (error.value) {
    message.warning(t(`hash.${error.value}`));
  } else {
    recordUsage('hash');
  }
}
</script>

<template>
  <div class="page-view">
    <div class="page-header-row">
      <PageHeader :title="t('hash.title')" :description="t('hash.description')" />
      <ApiDocModal feature-id="hash" />
    </div>

    <NCard class="form-card">
      <NForm :label-placement="isMobile ? 'top' : 'left'" label-width="auto">
        <NFormItem :label="t('hash.algorithm')">
          <NSelect v-model:value="algorithm" :options="algorithmOptions" />
        </NFormItem>
        <NFormItem :label="t('hash.text')">
          <NInput
            v-model:value="text"
            type="textarea"
            :placeholder="t('hash.textPlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }"
          />
        </NFormItem>
        <NFormItem>
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
