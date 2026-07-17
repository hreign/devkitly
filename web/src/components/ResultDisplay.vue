<script setup lang="ts">
import { ref } from 'vue';
import { NInput, NButton, NIcon } from 'naive-ui';
import { CopyOutline, CheckmarkOutline } from '@vicons/ionicons5';
import { useI18n } from 'vue-i18n';
import { useClipboard } from '@/utils/clipboard';

defineProps<{
  result: string;
  label?: string;
  multiline?: boolean;
}>();

const { t } = useI18n();
const { copyToClipboard } = useClipboard();
const copied = ref(false);

async function handleCopy(text: string) {
  await copyToClipboard(text);
  copied.value = true;
  setTimeout(() => {
    copied.value = false;
  }, 2000);
}
</script>

<template>
  <Transition name="result">
    <div v-if="result" class="result-card">
      <div class="result-header">
        <div class="result-label">
          <span class="result-bar" />
          <span class="result-title">{{ label || t('common.result') }}</span>
        </div>
        <NButton
          text
          type="primary"
          class="interactive"
          :aria-label="copied ? t('common.copied') : t('common.copy')"
          @click="handleCopy(result)"
        >
          <template #icon>
            <NIcon>
              <CheckmarkOutline v-if="copied" />
              <CopyOutline v-else />
            </NIcon>
          </template>
          {{ copied ? t('common.copied') : t('common.copy') }}
        </NButton>
      </div>
      <NInput
        v-if="multiline"
        :value="result"
        type="textarea"
        readonly
        :autosize="{ minRows: 3, maxRows: 12 }"
        class="result-input"
      />
      <NInput v-else :value="result" readonly class="result-input" />
    </div>
  </Transition>
</template>

<style scoped>
.result-card {
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

.result-input :deep(input),
.result-input :deep(textarea) {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-body-sm);
}
</style>
