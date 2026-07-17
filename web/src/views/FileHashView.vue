<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  NCard,
  NForm,
  NFormItem,
  NSelect,
  NButton,
  NUpload,
  NProgress,
  useMessage,
} from 'naive-ui';
import { useFileHash } from '@/composables/useFileHash';
import { useHistory } from '@/composables/useHistory';
import { useResponsive } from '@/composables/useResponsive';
import ApiDocModal from '@/components/ApiDocModal.vue';
import ResultDisplay from '@/components/ResultDisplay.vue';
import PageHeader from '@/components/PageHeader.vue';
import type { HashAlgorithm } from '@/types';

const { t } = useI18n();
const message = useMessage();
const { result, error, calculating, progress, calculate } = useFileHash();
const { recordUsage } = useHistory();
const { isMobile } = useResponsive();

const algorithm = ref<HashAlgorithm>('sha256');
const fileList = ref<any[]>([]);

const algorithmOptions = [
  { label: 'MD5', value: 'md5' },
  { label: 'SHA-256', value: 'sha256' },
];

function handleCalculate() {
  if (fileList.value.length === 0) {
    message.warning(t('fileHash.fileRequired'));
    return;
  }
  const file = fileList.value[0].file;
  calculate(file, algorithm.value);
  if (error.value) {
    message.warning(t(`fileHash.${error.value}`));
  } else if (result.value) {
    recordUsage('file-hash');
  }
}

function handleUploadChange(data: { fileList: any[] }) {
  fileList.value = data.fileList.slice(-1);
}
</script>

<template>
  <div class="page-view">
    <div class="page-header-row">
      <PageHeader :title="t('fileHash.title')" :description="t('fileHash.description')" />
      <ApiDocModal feature-id="file-hash" />
    </div>

    <NCard class="form-card">
      <NForm :label-placement="isMobile ? 'top' : 'left'" label-width="auto">
        <NFormItem :label="t('fileHash.algorithm')">
          <NSelect v-model:value="algorithm" :options="algorithmOptions" />
        </NFormItem>
        <NFormItem :label="t('fileHash.upload')">
          <NUpload
            :max="1"
            :default-upload="false"
            @change="handleUploadChange"
            accept="*/*"
          >
            <NButton>{{ t('fileHash.upload') }}</NButton>
          </NUpload>
        </NFormItem>
        <NFormItem v-if="calculating">
          <NProgress :percentage="progress" :indicator-placement="'inside'" processing />
        </NFormItem>
        <NFormItem>
          <NButton type="primary" :loading="calculating" :class="{ 'mobile-btn': isMobile }" @click="handleCalculate">
            {{ calculating ? t('fileHash.calculating') : t('common.calculate') }}
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
