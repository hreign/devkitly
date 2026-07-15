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
  NImage,
  useMessage,
} from 'naive-ui';
import { useQrCode } from '@/composables/useQrCode';
import { useHistory } from '@/composables/useHistory';
import { useClipboard } from '@/utils/clipboard';
import ApiDocModal from '@/components/ApiDocModal.vue';
import type { QrType, WifiEncryption } from '@/types';

const { t } = useI18n();
const message = useMessage();
const { result, error, generate } = useQrCode();
const { recordUsage } = useHistory();
const { copyToClipboard } = useClipboard();

const qrType = ref<QrType>('text');
const content = ref('');
const ssid = ref('');
const wifiPassword = ref('');
const encryption = ref<WifiEncryption | null>(null);

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
    <NCard :title="t('qr.title')">
      <template #header-extra>
        <ApiDocModal feature-id="qr" />
      </template>
      <NForm label-placement="left" label-width="auto">
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
        <NFormItem>
          <NSpace>
            <NButton type="primary" @click="handleGenerate">{{ t('common.generate') }}</NButton>
          </NSpace>
        </NFormItem>
      </NForm>
    </NCard>

    <NCard v-if="result" :title="t('common.result')" size="small" style="margin-top: 16px;">
      <template #header-extra>
        <NButton text type="primary" @click="copyToClipboard(result)">{{ t('common.copy') }}</NButton>
      </template>
      <div class="qr-result">
        <NImage
          :src="`data:image/png;base64,${result}`"
          alt="QR Code"
          width="256"
        />
      </div>
    </NCard>
  </div>
</template>

<style scoped>
.page-view {
  max-width: 700px;
  margin: 0 auto;
}

.qr-result {
  display: flex;
  justify-content: center;
  padding: 16px;
}
</style>
