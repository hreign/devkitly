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
import { useCodec } from '@/composables/useCodec';
import { useHistory } from '@/composables/useHistory';
import { useResponsive } from '@/composables/useResponsive';
import ApiDocModal from '@/components/ApiDocModal.vue';
import ResultDisplay from '@/components/ResultDisplay.vue';
import PageHeader from '@/components/PageHeader.vue';
import type { CodecFormat } from '@/types';

const { t } = useI18n();
const message = useMessage();
const { result, error, convert } = useCodec();
const { recordUsage } = useHistory();
const { isMobile } = useResponsive();

const from = ref<CodecFormat>('utf8');
const to = ref<CodecFormat>('base64');
const text = ref('');

const formatOptions = [
  { label: 'Base64', value: 'base64' },
  { label: 'Hex', value: 'hex' },
  { label: 'UTF-8', value: 'utf8' },
  { label: 'Unicode', value: 'unicode' },
  { label: 'URL', value: 'url' },
];

function handleConvert() {
  convert(from.value, to.value, text.value);
  if (error.value) {
    message.warning(t(`codec.${error.value}`));
  } else {
    recordUsage('codec');
  }
}
</script>

<template>
  <div class="page-view">
    <div class="page-header-row">
      <PageHeader :title="t('codec.title')" :description="t('codec.description')" />
      <ApiDocModal feature-id="codec" />
    </div>

    <NCard class="form-card">
      <NForm :label-placement="isMobile ? 'top' : 'left'" label-width="auto">
        <NFormItem :label="t('codec.from')">
          <NSelect v-model:value="from" :options="formatOptions" />
        </NFormItem>
        <NFormItem :label="t('codec.to')">
          <NSelect v-model:value="to" :options="formatOptions" />
        </NFormItem>
        <NFormItem :label="t('codec.text')">
          <NInput
            v-model:value="text"
            type="textarea"
            :placeholder="t('codec.textPlaceholder')"
            :autosize="{ minRows: 3, maxRows: 10 }"
          />
        </NFormItem>
        <NFormItem>
          <NButton type="primary" :class="{ 'mobile-btn': isMobile }" @click="handleConvert">
            {{ t('common.convert') }}
          </NButton>
        </NFormItem>
      </NForm>
    </NCard>

    <ResultDisplay v-if="result" :result="result" :multiline="true" />
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
