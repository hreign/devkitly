<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import {
  NCard,
  NForm,
  NFormItem,
  NInput,
  NButton,
  useMessage,
} from 'naive-ui';
import { useAsymmetric } from '@/composables/useAsymmetric';
import { useHistory } from '@/composables/useHistory';
import { useClipboard } from '@/utils/clipboard';
import { useResponsive } from '@/composables/useResponsive';
import { usePersistedRef } from '@/composables/usePersistedRef';
import PageHeader from '@/components/PageHeader.vue';
import ResultDisplay from '@/components/ResultDisplay.vue';
import TabRadioGroup from '@/components/TabRadioGroup.vue';
import type { AsymmetricMode, RsaKeySize } from '@/types';

const { t } = useI18n();
const message = useMessage();
const {
  publicKey,
  privateKey,
  ciphertext,
  plaintext,
  error,
  generating,
  processing,
  isWebCryptoAvailable,
  generateKeyPair,
  encryptWithPublicKey,
  decryptWithPrivateKey,
} = useAsymmetric();
const { recordUsage } = useHistory();
const { copyToClipboard } = useClipboard();
const { isMobile, formLabelWidth } = useResponsive();
const labelWidth = formLabelWidth('asymmetric.publicKey');

const mode = usePersistedRef<AsymmetricMode>('devkitly-asymmetric-mode', 'generate');
const keySize = usePersistedRef<string>('devkitly-asymmetric-key-size', '2048');
const inputPublicKey = usePersistedRef<string>('devkitly-asymmetric-pubkey', '');
const inputPlaintext = usePersistedRef<string>('devkitly-asymmetric-plaintext', '');
const inputPrivateKey = usePersistedRef<string>('devkitly-asymmetric-privkey', '');
const inputCiphertext = usePersistedRef<string>('devkitly-asymmetric-ciphertext', '');

const modeOptions = [
  { label: '生成密钥', value: 'generate' },
  { label: '加密', value: 'encrypt' },
  { label: '解密', value: 'decrypt' },
];

const keySizeOptions = [
  { label: '2048', value: '2048' },
  { label: '4096', value: '4096' },
];

const cryptoAvailable = isWebCryptoAvailable();

async function handleGenerate() {
  await generateKeyPair(Number(keySize.value) as RsaKeySize);
  if (error.value) {
    message.warning(t(`asymmetric.${error.value}`));
  } else {
    recordUsage('asymmetric');
  }
}

async function handleEncrypt() {
  if (!inputPublicKey.value) {
    message.warning(t('asymmetric.publicKeyRequired'));
    return;
  }
  if (!inputPlaintext.value) {
    message.warning(t('asymmetric.plaintextRequired'));
    return;
  }
  await encryptWithPublicKey(inputPublicKey.value, inputPlaintext.value);
  if (error.value) {
    message.warning(t(`asymmetric.${error.value}`));
  } else {
    recordUsage('asymmetric');
  }
}

async function handleDecrypt() {
  if (!inputPrivateKey.value) {
    message.warning(t('asymmetric.privateKeyRequired'));
    return;
  }
  if (!inputCiphertext.value) {
    message.warning(t('asymmetric.ciphertextRequired'));
    return;
  }
  await decryptWithPrivateKey(inputPrivateKey.value, inputCiphertext.value);
  if (error.value) {
    message.warning(t(`asymmetric.${error.value}`));
  } else {
    recordUsage('asymmetric');
  }
}

function handleAction() {
  if (mode.value === 'generate') handleGenerate();
  else if (mode.value === 'encrypt') handleEncrypt();
  else handleDecrypt();
}
</script>

<template>
  <div class="page-view">
    <div class="page-header-row">
      <PageHeader :title="t('asymmetric.title')" :description="t('asymmetric.description')" />
    </div>

    <NCard v-if="!cryptoAvailable" class="form-card">
      <div class="unsupported-tip">{{ t('asymmetric.webCryptoUnsupported') }}</div>
    </NCard>

    <template v-else>
      <NCard class="form-card">
        <NForm :label-placement="isMobile ? 'top' : 'left'" :label-width="labelWidth">
          <NFormItem :label="t('asymmetric.mode')">
            <TabRadioGroup v-model="mode" :options="modeOptions" :aria-label="t('asymmetric.mode')" />
          </NFormItem>

          <template v-if="mode === 'generate'">
            <NFormItem :label="t('asymmetric.keySize')">
              <TabRadioGroup v-model="keySize" :options="keySizeOptions" :aria-label="t('asymmetric.keySize')" />
            </NFormItem>
          </template>

          <template v-else-if="mode === 'encrypt'">
            <NFormItem :label="t('asymmetric.publicKey')">
              <NInput
                v-model:value="inputPublicKey"
                type="textarea"
                :placeholder="t('asymmetric.publicKeyPlaceholder')"
                :autosize="{ minRows: 4, maxRows: 10 }"
              />
            </NFormItem>
            <NFormItem :label="t('asymmetric.plaintext')">
              <NInput
                v-model:value="inputPlaintext"
                type="textarea"
                :placeholder="t('asymmetric.plaintextPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </NFormItem>
          </template>

          <template v-else>
            <NFormItem :label="t('asymmetric.privateKey')">
              <NInput
                v-model:value="inputPrivateKey"
                type="textarea"
                :placeholder="t('asymmetric.privateKeyPlaceholder')"
                :autosize="{ minRows: 4, maxRows: 10 }"
              />
            </NFormItem>
            <NFormItem :label="t('asymmetric.ciphertext')">
              <NInput
                v-model:value="inputCiphertext"
                type="textarea"
                :placeholder="t('asymmetric.ciphertextPlaceholder')"
                :autosize="{ minRows: 3, maxRows: 10 }"
              />
            </NFormItem>
          </template>

          <NFormItem label=" ">
            <NButton
              type="primary"
              :loading="generating || processing"
              :class="{ 'mobile-btn': isMobile }"
              @click="handleAction"
            >
              {{ generating ? t('asymmetric.generating') : processing ? (mode === 'encrypt' ? t('asymmetric.encrypting') : t('asymmetric.decrypting')) : (mode === 'generate' ? t('asymmetric.generate') : mode === 'encrypt' ? t('asymmetric.encrypt') : t('asymmetric.decrypt')) }}
            </NButton>
          </NFormItem>
        </NForm>
      </NCard>

      <Transition name="result">
        <div v-if="mode === 'generate' && publicKey" class="result-area">
          <div class="key-result">
            <div class="result-header">
              <div class="result-label">
                <span class="result-bar" />
                <span class="result-title">{{ t('asymmetric.publicKey') }}</span>
              </div>
              <NButton text type="primary" class="interactive" @click="copyToClipboard(publicKey)">
                {{ t('common.copy') }}
              </NButton>
            </div>
            <ResultDisplay :result="publicKey" />
          </div>
          <div class="key-result">
            <div class="result-header">
              <div class="result-label">
                <span class="result-bar" />
                <span class="result-title">{{ t('asymmetric.privateKey') }}</span>
              </div>
              <NButton text type="primary" class="interactive" @click="copyToClipboard(privateKey)">
                {{ t('common.copy') }}
              </NButton>
            </div>
            <ResultDisplay :result="privateKey" />
          </div>
        </div>
      </Transition>

      <ResultDisplay v-if="mode === 'encrypt' && ciphertext" :result="ciphertext" />
      <ResultDisplay v-if="mode === 'decrypt' && plaintext" :result="plaintext" />
    </template>
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

.unsupported-tip {
  text-align: center;
  padding: var(--spacing-lg);
  color: var(--color-text-secondary);
  font-size: var(--font-size-body);
}

.result-area {
  margin-top: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.key-result {
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

.mobile-btn {
  width: 100%;
}
</style>
