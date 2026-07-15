<script setup lang="ts">
import { NCard, NInput, NButton, NIcon } from 'naive-ui';
import { CopyOutline } from '@vicons/ionicons5';
import { useI18n } from 'vue-i18n';
import { useClipboard } from '@/utils/clipboard';

defineProps<{
  result: string;
  label?: string;
  multiline?: boolean;
}>();

const { t } = useI18n();
const { copyToClipboard } = useClipboard();
</script>

<template>
  <NCard v-if="result" :title="label || t('common.result')" size="small" class="result-card">
    <template #header-extra>
      <NButton text type="primary" @click="copyToClipboard(result)">
        <template #icon>
          <NIcon><CopyOutline /></NIcon>
        </template>
        {{ t('common.copy') }}
      </NButton>
    </template>
    <NInput
      v-if="multiline"
      :value="result"
      type="textarea"
      readonly
      :autosize="{ minRows: 3, maxRows: 12 }"
    />
    <NInput v-else :value="result" readonly />
  </NCard>
</template>

<style scoped>
.result-card {
  margin-top: 16px;
}
</style>
