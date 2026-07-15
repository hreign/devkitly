<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import {
  NCard,
  NForm,
  NFormItem,
  NInputNumber,
  NCheckbox,
  NInput,
  NButton,
  NSpace,
  useMessage,
} from 'naive-ui';
import { usePassword } from '@/composables/usePassword';
import { useHistory } from '@/composables/useHistory';
import ApiDocModal from '@/components/ApiDocModal.vue';
import ResultDisplay from '@/components/ResultDisplay.vue';

const { t } = useI18n();
const message = useMessage();
const { result, error, generate } = usePassword();
const { recordUsage } = useHistory();

const length = ref(16);
const includeUpper = ref(true);
const includeLower = ref(true);
const includeNumber = ref(true);
const includeSymbol = ref(true);
const customSymbols = ref('');

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
    <NCard :title="t('password.title')">
      <template #header-extra>
        <ApiDocModal feature-id="password" />
      </template>
      <NForm label-placement="left" label-width="auto">
        <NFormItem :label="t('password.length')">
          <NInputNumber v-model:value="length" :min="8" :max="256" style="width: 100%;" />
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
        <NFormItem>
          <NSpace>
            <NButton type="primary" @click="handleGenerate">{{ t('common.generate') }}</NButton>
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
