<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NSelect,
  NButton,
  NImage,
  useMessage,
} from 'naive-ui';
import { useQrCode } from '@/composables/useQrCode';
import { useHistory } from '@/composables/useHistory';
import { useClipboard } from '@/utils/clipboard';
import { useResponsive } from '@/composables/useResponsive';
import { usePersistedRef } from '@/composables/usePersistedRef';
import ApiDocModal from '@/components/ApiDocModal.vue';
import PageHeader from '@/components/PageHeader.vue';
import type { QrType, WifiEncryption } from '@/types';

const { t } = useI18n();
const message = useMessage();
const { result, error, generate } = useQrCode();
const { recordUsage } = useHistory();
const { copyToClipboard } = useClipboard();
const { isMobile, formLabelWidth } = useResponsive();
const labelWidth = formLabelWidth('qr.encryption');

const qrType = usePersistedRef<QrType>('devkitly-qr-type', 'text');
const content = usePersistedRef<string>('devkitly-qr-content', '');
const ssid = usePersistedRef<string>('devkitly-qr-ssid', '');
const wifiPassword = usePersistedRef<string>('devkitly-qr-wifi-password', '');
const encryption = usePersistedRef<WifiEncryption | null>('devkitly-qr-encryption', null);

const typeOptions = [
  { label: () => t('qr.text'), value: 'text' },
  { label: () => t('qr.wifi'), value: 'wifi' },
];

const encryptionOptions = [
  { label: 'WPA', value: 'WPA' },
  { label: 'WEP', value: 'WEP' },
  { label: 'nopass', value: 'nopass' },
];

async function handleGenerate() {
  if (qrType.value === 'text') {
    if (!content.value) {
      message.warning(t('qr.contentRequired'));
      return;
    }
    if (content.value.length > 256) {
      message.warning(t('qr.contentTooLong'));
      return;
    }
    await generate('text', { content: content.value });
  } else {
    if (!ssid.value) {
      message.warning(t('qr.ssidRequired'));
      return;
    }
    if (!wifiPassword.value) {
      message.warning(t('qr.wifiPasswordRequired'));
      return;
    }
    if (!encryption.value) {
      message.warning(t('qr.encryptionRequired'));
      return;
    }
    await generate('wifi', {
      ssid: ssid.value,
      password: wifiPassword.value,
      encryption: encryption.value,
    });
  }

  if (!error.value) {
    recordUsage('qr');
  }
}
</script>

<template>
  <div class="page-view">
    <div class="page-header-row">
      <PageHeader :title="t('qr.title')" :description="t('qr.description')" />
      <ApiDocModal feature-id="qr" />
    </div>

    <NCard class="form-card">
      <NForm :label-placement="isMobile ? 'top' : 'left'" :label-width="labelWidth">
        <NFormItem :label="t('qr.type')">
          <NSelect v-model:value="qrType" :options="typeOptions" />
        </NFormItem>
        <template v-if="qrType === 'text'">
          <NFormItem :label="t('qr.content')">
            <NInput
              v-model:value="content"
              type="textarea"
              :placeholder="t('qr.contentPlaceholder')"
              :maxlength="256"
              show-count
            />
          </NFormItem>
        </template>
        <template v-else>
          <NFormItem :label="t('qr.ssid')">
            <NInput v-model:value="ssid" :placeholder="t('qr.ssidPlaceholder')" />
          </NFormItem>
          <NFormItem :label="t('qr.wifiPassword')">
            <NInput
              v-model:value="wifiPassword"
              type="password"
              show-password-on="click"
              :placeholder="t('qr.wifiPasswordPlaceholder')"
            />
          </NFormItem>
          <NFormItem :label="t('qr.encryption')">
            <NSelect
              v-model:value="encryption"
              :options="encryptionOptions"
              :placeholder="t('common.selectPlaceholder')"
            />
          </NFormItem>
        </template>
        <NFormItem label=" ">
          <NButton type="primary" :class="{ 'mobile-btn': isMobile }" @click="handleGenerate">
            {{ t('common.generate') }}
          </NButton>
        </NFormItem>
      </NForm>
    </NCard>

    <Transition name="result">
      <NCard v-if="result" size="small" class="result-card">
        <template #header>
          <div class="result-label">
            <span class="result-bar" />
            <span>{{ t('common.result') }}</span>
          </div>
        </template>
        <template #header-extra>
          <NButton text type="primary" class="interactive" :aria-label="t('common.copy')" @click="copyToClipboard(result)">
            {{ t('common.copy') }}
          </NButton>
        </template>
        <div class="qr-result">
          <NImage
            :src="`data:image/png;base64,${result}`"
            alt="QR Code"
            width="256"
          />
        </div>
      </NCard>
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

.result-card {
  margin-top: var(--spacing-lg);
  background-color: var(--color-bg-elevated);
  border-radius: var(--radius-lg);
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

.qr-result {
  display: flex;
  justify-content: center;
  padding: var(--spacing-md);
}

.mobile-btn {
  width: 100%;
}
</style>
