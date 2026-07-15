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
import { useCodec } from '@/composables/useCodec';
import { useHistory } from '@/composables/useHistory';
import ApiDocModal from '@/components/ApiDocModal.vue';
import ResultDisplay from '@/components/ResultDisplay.vue';
import type { CodecFormat } from '@/types';

const { t } = useI18n();
const message = useMessage();
const { result, error, convert } = useCodec();
const { recordUsage } = useHistory();

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
    <NCard :title="t('codec.title')">
      <template #header-extra>
        <ApiDocModal feature-id="codec" />
      </template>
      <NForm label-placement="left" label-width="auto">
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
          <NSpace>
            <NButton type="primary" @click="handleConvert">{{ t('common.convert') }}</NButton>
          </NSpace>
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
</style>
