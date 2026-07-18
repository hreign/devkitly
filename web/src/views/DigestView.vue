<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  NUpload,
  NProgress,
  useMessage,
} from 'naive-ui';
import { useDigest } from '@/composables/useDigest';
import { useHistory } from '@/composables/useHistory';
import { useResponsive } from '@/composables/useResponsive';
import { usePersistedRef } from '@/composables/usePersistedRef';
import ApiDocModal from '@/components/ApiDocModal.vue';
import ResultDisplay from '@/components/ResultDisplay.vue';
import PageHeader from '@/components/PageHeader.vue';
import TabRadioGroup from '@/components/TabRadioGroup.vue';
import type { DigestInputType, HashAlgorithm } from '@/types';

const { t } = useI18n();
const message = useMessage();
const route = useRoute();
const { inputType, algorithm, result, error, calculating, progress, calculateTextHash, calculateFileHash } = useDigest();
const { recordUsage } = useHistory();
const { isMobile, formLabelWidth } = useResponsive();
const labelWidth = formLabelWidth('digest.textInput');

const text = usePersistedRef<string>('devkitly-digest-text', '');
const algorithmPersisted = usePersistedRef<HashAlgorithm>('devkitly-digest-algorithm', 'sha256');
const inputTypePersisted = usePersistedRef<DigestInputType>('devkitly-digest-input-type', 'text');
const fileList = ref<any[]>([]);

// 同步持久化值
algorithm.value = algorithmPersisted.value;
inputType.value = inputTypePersisted.value;

// 监听变化同步回持久化
import { watch } from 'vue';
watch(algorithm, (val) => { algorithmPersisted.value = val; });
watch(inputType, (val) => { inputTypePersisted.value = val; });

const inputTypeOptions = [
  { label: '文本', value: 'text' },
  { label: '文件', value: 'file' },
];

const algorithmOptions = [
  { label: 'MD5', value: 'md5' },
  { label: 'SHA-256', value: 'sha256' },
];

function handleCalculate() {
  if (inputType.value === 'text') {
    if (!text.value) {
      message.warning(t('digest.textRequired'));
      return;
    }
    calculateTextHash(text.value);
  } else {
    if (fileList.value.length === 0) {
      message.warning(t('digest.fileRequired'));
      return;
    }
    const file = fileList.value[0].file;
    calculateFileHash(file);
  }

  if (error.value) {
    message.warning(t(`digest.${error.value}`));
  } else if (result.value) {
    recordUsage('digest');
  }
}

function handleUploadChange(data: { fileList: any[] }) {
  fileList.value = data.fileList.slice(-1);
}

onMounted(() => {
  if (route.query.type === 'file') {
    inputType.value = 'file';
  }
});
</script>

<template>
  <div class="page-view">
    <div class="page-header-row">
      <PageHeader :title="t('digest.title')" :description="t('digest.description')" />
      <ApiDocModal feature-id="digest" />
    </div>

    <NCard class="form-card">
      <NForm :label-placement="isMobile ? 'top' : 'left'" :label-width="labelWidth">
        <NFormItem :label="t('digest.inputType')">
          <TabRadioGroup v-model="inputType" :options="inputTypeOptions" :aria-label="t('digest.inputType')" />
        </NFormItem>
        <NFormItem :label="t('digest.algorithm')">
          <TabRadioGroup v-model="algorithm" :options="algorithmOptions" :aria-label="t('digest.algorithm')" />
        </NFormItem>
        <template v-if="inputType === 'text'">
          <NFormItem :label="t('digest.textInput')">
            <NInput
              v-model:value="text"
              type="textarea"
              :placeholder="t('digest.textInputPlaceholder')"
              :autosize="{ minRows: 3, maxRows: 10 }"
            />
          </NFormItem>
        </template>
        <template v-else>
          <NFormItem :label="t('digest.upload')">
            <NUpload
              :max="1"
              :default-upload="false"
              @change="handleUploadChange"
              accept="*/*"
            >
              <NButton>{{ t('digest.upload') }}</NButton>
            </NUpload>
          </NFormItem>
          <NFormItem v-if="calculating">
            <NProgress :percentage="progress" :indicator-placement="'inside'" processing />
          </NFormItem>
        </template>
        <NFormItem label=" ">
          <NButton type="primary" :loading="calculating" :class="{ 'mobile-btn': isMobile }" @click="handleCalculate">
            {{ calculating ? t('digest.calculating') : t('common.calculate') }}
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
