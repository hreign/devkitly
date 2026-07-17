<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  NCard,
  NForm,
  NFormItem,
  NInputNumber,
  NCheckbox,
  NInput,
  NButton,
  useMessage,
} from 'naive-ui';
import { usePassword } from '@/composables/usePassword';
import { useHistory } from '@/composables/useHistory';
import { useResponsive } from '@/composables/useResponsive';
import { usePersistedRef } from '@/composables/usePersistedRef';
import ApiDocModal from '@/components/ApiDocModal.vue';
import ResultDisplay from '@/components/ResultDisplay.vue';
import PageHeader from '@/components/PageHeader.vue';

const { t } = useI18n();
const message = useMessage();
const { result, error, generate } = usePassword();
const { recordUsage } = useHistory();
const { isMobile, formLabelWidth } = useResponsive();
const labelWidth = formLabelWidth('password.includeSymbol');

const length = usePersistedRef<number>('devkitly-pwd-length', 16);
const includeUpper = usePersistedRef<boolean>('devkitly-pwd-upper', true);
const includeLower = usePersistedRef<boolean>('devkitly-pwd-lower', true);
const includeNumber = usePersistedRef<boolean>('devkitly-pwd-number', true);
const includeSymbol = usePersistedRef<boolean>('devkitly-pwd-symbol', true);
const customSymbols = usePersistedRef<string>('devkitly-pwd-custom-symbols', '');

function handleGenerate() {
  generate({
    length: length.value,
    includeUpper: includeUpper.value,
    includeLower: includeLower.value,
    includeNumber: includeNumber.value,
    includeSymbol: includeSymbol.value,
    customSymbols: customSymbols.value || undefined,
  });
  if (error.value) {
    message.warning(t(`password.${error.value}`));
  } else {
    recordUsage('password');
  }
}
</script>

<template>
  <div class="page-view">
    <div class="page-header-row">
      <PageHeader :title="t('password.title')" :description="t('password.description')" />
      <ApiDocModal feature-id="password" />
    </div>

    <NCard class="form-card">
      <NForm :label-placement="isMobile ? 'top' : 'left'" :label-width="labelWidth">
        <NFormItem :label="t('password.length')">
          <NInputNumber v-model:value="length" :min="4" :max="256" style="width: 100%;" />
        </NFormItem>
        <NFormItem :label="t('password.includeUpper')">
          <NCheckbox v-model:checked="includeUpper" />
        </NFormItem>
        <NFormItem :label="t('password.includeLower')">
          <NCheckbox v-model:checked="includeLower" />
        </NFormItem>
        <NFormItem :label="t('password.includeNumber')">
          <NCheckbox v-model:checked="includeNumber" />
        </NFormItem>
        <NFormItem :label="t('password.includeSymbol')">
          <NCheckbox v-model:checked="includeSymbol" />
        </NFormItem>
        <NFormItem v-if="includeSymbol" :label="t('password.customSymbols')">
          <NInput v-model:value="customSymbols" :placeholder="t('password.customSymbolsPlaceholder')" />
        </NFormItem>
        <NFormItem label=" ">
          <NButton type="primary" :class="{ 'mobile-btn': isMobile }" @click="handleGenerate">
            {{ t('common.generate') }}
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
