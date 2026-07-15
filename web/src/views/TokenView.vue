<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NButton,
  NSpace,
  useMessage,
} from 'naive-ui';
import { useToken } from '@/composables/useToken';
import { useHistory } from '@/composables/useHistory';
import { useClipboard } from '@/utils/clipboard';
import ApiDocModal from '@/components/ApiDocModal.vue';

const { t } = useI18n();
const message = useMessage();
const { result, error, generate } = useToken();
const { recordUsage } = useHistory();
const { copyToClipboard } = useClipboard();

const prefix = ref('');
const length = ref(32);
const count = ref(1);

function handleGenerate() {
  generate({
    prefix: prefix.value,
    length: length.value,
    count: count.value,
  });
  if (error.value) {
    message.warning(t(`token.${error.value}`));
  } else {
    recordUsage('token');
  }
}

function copyAll() {
  copyToClipboard(result.value.join('\n'));
}
</script>

<template>
  <div class="page-view">
    <NCard :title="t('token.title')">
      <template #header-extra>
        <ApiDocModal feature-id="token" />
      </template>
      <NForm label-placement="left" label-width="auto">
        <NFormItem :label="t('token.prefix')">
          <NInput v-model:value="prefix" :placeholder="t('token.prefixPlaceholder')" :maxlength="16" />
        </NFormItem>
        <NFormItem :label="t('token.length')">
          <NInputNumber v-model:value="length" :min="1" :max="256" style="width: 100%;" />
        </NFormItem>
        <NFormItem :label="t('token.count')">
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
      <div class="token-list">
        <div v-for="(token, index) in result" :key="index" class="token-item">
          <code>{{ token }}</code>
          <NButton text size="small" type="primary" @click="copyToClipboard(token)">{{ t('common.copy') }}</NButton>
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

.token-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.token-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--n-color-embedded);
}

.token-item code {
  font-size: 14px;
  word-break: break-all;
}
</style>
