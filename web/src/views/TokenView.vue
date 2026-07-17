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
  NIcon,
  useMessage,
} from 'naive-ui';
import { CopyOutline, CheckmarkOutline } from '@vicons/ionicons5';
import { useToken } from '@/composables/useToken';
import { useHistory } from '@/composables/useHistory';
import { useClipboard } from '@/utils/clipboard';
import { useResponsive } from '@/composables/useResponsive';
import ApiDocModal from '@/components/ApiDocModal.vue';
import PageHeader from '@/components/PageHeader.vue';

const { t } = useI18n();
const message = useMessage();
const { result, error, generate } = useToken();
const { recordUsage } = useHistory();
const { copyToClipboard } = useClipboard();
const { isMobile } = useResponsive();

const prefix = ref('');
const length = ref(32);
const count = ref(1);

const copiedIndex = ref<number | null>(null);

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

async function copyItem(token: string, index: number) {
  await copyToClipboard(token);
  copiedIndex.value = index;
  setTimeout(() => {
    copiedIndex.value = null;
  }, 2000);
}
</script>

<template>
  <div class="page-view">
    <div class="page-header-row">
      <PageHeader :title="t('token.title')" :description="t('token.description')" />
      <ApiDocModal feature-id="token" />
    </div>

    <NCard class="form-card">
      <NForm :label-placement="isMobile ? 'top' : 'left'" label-width="auto">
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
        <div class="token-list">
          <div
            v-for="(token, index) in result"
            :key="index"
            class="token-item interactive"
          >
            <code class="token-code">{{ token }}</code>
            <NButton
              text
              size="small"
              type="primary"
              class="interactive"
              :aria-label="copiedIndex === index ? t('common.copied') : t('common.copy')"
              @click="copyItem(token, index)"
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

.token-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.token-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-sm);
  background-color: var(--color-bg-card);
  transition: background 0.2s ease;
}

.token-item:hover {
  background-color: var(--color-bg-elevated);
}

.token-code {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-body-sm);
  word-break: break-all;
}

.mobile-btn {
  width: 100%;
}
</style>
