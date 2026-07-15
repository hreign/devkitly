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
  NSpace,
  useMessage,
} from 'naive-ui';
import { useHash } from '@/composables/useHash';
import { useHistory } from '@/composables/useHistory';
import ApiDocModal from '@/components/ApiDocModal.vue';
import ResultDisplay from '@/components/ResultDisplay.vue';
import type { HashAlgorithm } from '@/types';

const { t } = useI18n();
const message = useMessage();
const { result, error, calculate } = useHash();
const { recordUsage } = useHistory();

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
    <NCard :title="t('hash.title')">
      <template #header-extra>
        <ApiDocModal feature-id="hash" />
      </template>
      <NForm label-placement="left" label-width="auto">
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
          <NSpace>
            <NButton type="primary" @click="handleCalculate">{{ t('common.calculate') }}</NButton>
          </NSpace>
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
</style>
