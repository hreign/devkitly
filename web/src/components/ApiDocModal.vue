<script setup lang="ts">
import { ref, computed } from 'vue';
import { NButton, NModal, NIcon, NCode, NTable } from 'naive-ui';
import {
  DocumentTextOutline,
  CopyOutline,
  CheckmarkOutline,
} from '@vicons/ionicons5';
import { useI18n } from 'vue-i18n';
import { useClipboard } from '@/utils/clipboard';
import type { FeatureId } from '@/types';

const props = defineProps<{
  featureId: FeatureId;
}>();

const { t } = useI18n();
const { copyToClipboard } = useClipboard();
const showModal = ref(false);

const hasBackendUrl = computed(() => !!import.meta.env.VITE_BACKEND_URL);
const baseUrl = computed(
  () => import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000',
);

const copiedResponse = ref(false);
const copiedCurl = ref(false);

async function handleCopy(text: string, target: 'response' | 'curl') {
  await copyToClipboard(text);
  if (target === 'response') {
    copiedResponse.value = true;
    setTimeout(() => {
      copiedResponse.value = false;
    }, 2000);
  } else {
    copiedCurl.value = true;
    setTimeout(() => {
      copiedCurl.value = false;
    }, 2000);
  }
}

interface ApiParam {
  name: string;
  type: string;
  required: boolean;
  description: string;
}

interface ApiDoc {
  path: string;
  method: string;
  params: ApiParam[];
  response: string;
  curlExample: string;
}

const apiDocs: Record<FeatureId, ApiDoc> = {
  qr: {
    path: '/api/qr',
    method: 'POST',
    params: [
      {
        name: 'type',
        type: 'string',
        required: true,
        description: t('apiDoc.qr.typeDesc'),
      },
      {
        name: 'content',
        type: 'string',
        required: false,
        description: t('apiDoc.qr.contentDesc'),
      },
      {
        name: 'ssid',
        type: 'string',
        required: false,
        description: t('apiDoc.qr.ssidDesc'),
      },
      {
        name: 'password',
        type: 'string',
        required: false,
        description: t('apiDoc.qr.passwordDesc'),
      },
      {
        name: 'encryption',
        type: 'string',
        required: false,
        description: t('apiDoc.qr.encryptionDesc'),
      },
    ],
    response: `{
  "code": 0,
  "msg": "成功",
  "data": {
    "image": "base64 PNG"
  }
}`,
    curlExample: `curl -X POST ${baseUrl.value}/api/qr \\
  -H "Content-Type: application/json" \\
  -d '{"type":"text","content":"Hello World"}'`,
  },
  uuid: {
    path: '/api/uuid',
    method: 'POST',
    params: [
      {
        name: 'version',
        type: 'string',
        required: true,
        description: t('apiDoc.uuid.versionDesc'),
      },
      {
        name: 'count',
        type: 'number',
        required: false,
        description: t('apiDoc.uuid.countDesc'),
      },
      {
        name: 'namespace',
        type: 'string',
        required: false,
        description: t('apiDoc.uuid.namespaceDesc'),
      },
      {
        name: 'name',
        type: 'string',
        required: false,
        description: t('apiDoc.uuid.nameDesc'),
      },
    ],
    response: `{
  "code": 0,
  "msg": "成功",
  "data": {
    "uuids": ["string"]
  }
}`,
    curlExample: `curl -X POST ${baseUrl.value}/api/uuid \\
  -H "Content-Type: application/json" \\
  -d '{"version":"v4","count":5}'`,
  },
  password: {
    path: '/api/password',
    method: 'POST',
    params: [
      {
        name: 'length',
        type: 'number',
        required: false,
        description: t('apiDoc.password.lengthDesc'),
      },
      {
        name: 'includeUpper',
        type: 'boolean',
        required: false,
        description: t('apiDoc.password.includeUpperDesc'),
      },
      {
        name: 'includeLower',
        type: 'boolean',
        required: false,
        description: t('apiDoc.password.includeLowerDesc'),
      },
      {
        name: 'includeNumber',
        type: 'boolean',
        required: false,
        description: t('apiDoc.password.includeNumberDesc'),
      },
      {
        name: 'includeSymbol',
        type: 'boolean',
        required: false,
        description: t('apiDoc.password.includeSymbolDesc'),
      },
      {
        name: 'customSymbols',
        type: 'string',
        required: false,
        description: t('apiDoc.password.customSymbolsDesc'),
      },
    ],
    response: `{
  "code": 0,
  "msg": "成功",
  "data": {
    "password": "string"
  }
}`,
    curlExample: `curl -X POST ${baseUrl.value}/api/password \\
  -H "Content-Type: application/json" \\
  -d '{"length":16,"includeUpper":true,"includeLower":true,"includeNumber":true,"includeSymbol":true}'`,
  },
  hash: {
    path: '/api/hash',
    method: 'POST',
    params: [
      {
        name: 'algorithm',
        type: 'string',
        required: true,
        description: t('apiDoc.hash.algorithmDesc'),
      },
      {
        name: 'text',
        type: 'string',
        required: true,
        description: t('apiDoc.hash.textDesc'),
      },
    ],
    response: `{
  "code": 0,
  "msg": "成功",
  "data": {
    "hash": "string"
  }
}`,
    curlExample: `curl -X POST ${baseUrl.value}/api/hash \\
  -H "Content-Type: application/json" \\
  -d '{"algorithm":"sha256","text":"Hello World"}'`,
  },
  codec: {
    path: '/api/codec',
    method: 'POST',
    params: [
      {
        name: 'from',
        type: 'string',
        required: true,
        description: t('apiDoc.codec.fromDesc'),
      },
      {
        name: 'to',
        type: 'string',
        required: true,
        description: t('apiDoc.codec.toDesc'),
      },
      {
        name: 'text',
        type: 'string',
        required: true,
        description: t('apiDoc.codec.textDesc'),
      },
    ],
    response: `{
  "code": 0,
  "msg": "成功",
  "data": {
    "result": "string"
  }
}`,
    curlExample: `curl -X POST ${baseUrl.value}/api/codec \\
  -H "Content-Type: application/json" \\
  -d '{"from":"utf8","to":"base64","text":"Hello World"}'`,
  },
  'file-hash': {
    path: '/api/file-hash',
    method: 'POST',
    params: [
      {
        name: 'file',
        type: 'File',
        required: true,
        description: t('apiDoc.fileHash.fileDesc'),
      },
      {
        name: 'algorithm',
        type: 'string',
        required: true,
        description: t('apiDoc.fileHash.algorithmDesc'),
      },
    ],
    response: `{
  "code": 0,
  "msg": "成功",
  "data": {
    "hash": "string"
  }
}`,
    curlExample: `curl -X POST ${baseUrl.value}/api/file-hash \\
  -F "file=@/path/to/file" \\
  -F "algorithm=sha256"`,
  },
  token: {
    path: '/api/token',
    method: 'POST',
    params: [
      {
        name: 'prefix',
        type: 'string',
        required: false,
        description: t('apiDoc.token.prefixDesc'),
      },
      {
        name: 'length',
        type: 'number',
        required: false,
        description: t('apiDoc.token.lengthDesc'),
      },
      {
        name: 'count',
        type: 'number',
        required: false,
        description: t('apiDoc.token.countDesc'),
      },
    ],
    response: `{
  "code": 0,
  "msg": "成功",
  "data": {
    "tokens": ["string"]
  }
}`,
    curlExample: `curl -X POST ${baseUrl.value}/api/token \\
  -H "Content-Type: application/json" \\
  -d '{"prefix":"tk_","length":32,"count":3}'`,
  },
};

const currentDoc = computed(() => apiDocs[props.featureId]);
</script>

<template>
  <NButton v-if="hasBackendUrl" quaternary class="interactive" @click="showModal = true">
    <template #icon>
      <NIcon><DocumentTextOutline /></NIcon>
    </template>
    {{ t('common.apiDoc') }}
  </NButton>
  <NModal
    v-model:show="showModal"
    preset="card"
    :title="t('common.apiDocTitle')"
    style="max-width: 720px"
  >
    <div v-if="currentDoc" class="api-doc-content">
      <h4 class="doc-section-title">{{ t('apiDoc.requestUrl') }}</h4>
      <div class="code-block">
        <NCode
          :code="`${currentDoc.method} ${baseUrl}${currentDoc.path}`"
          language="text"
        />
      </div>

      <h4 class="doc-section-title">{{ t('apiDoc.requestParams') }}</h4>
      <NTable :bordered="true" :single-line="false" size="small" class="param-table">
        <thead>
          <tr>
            <th>{{ t('apiDoc.paramName') }}</th>
            <th>{{ t('apiDoc.paramType') }}</th>
            <th>{{ t('apiDoc.paramRequired') }}</th>
            <th>{{ t('apiDoc.paramDesc') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="param in currentDoc.params" :key="param.name">
            <td><NCode :code="param.name" language="text" inline /></td>
            <td>{{ param.type }}</td>
            <td>{{ param.required ? t('apiDoc.yes') : t('apiDoc.no') }}</td>
            <td>{{ param.description }}</td>
          </tr>
        </tbody>
      </NTable>

      <h4 class="doc-section-title">{{ t('apiDoc.responseResult') }}</h4>
      <div class="code-block">
        <button
          class="copy-btn interactive"
          :aria-label="copiedResponse ? t('common.copied') : t('common.copy')"
          @click="handleCopy(currentDoc.response, 'response')"
        >
          <NIcon size="16">
            <CheckmarkOutline v-if="copiedResponse" />
            <CopyOutline v-else />
          </NIcon>
        </button>
        <NCode :code="currentDoc.response" language="json" />
      </div>

      <h4 class="doc-section-title">{{ t('apiDoc.requestExample') }}</h4>
      <div class="code-block">
        <button
          class="copy-btn interactive"
          :aria-label="copiedCurl ? t('common.copied') : t('common.copy')"
          @click="handleCopy(currentDoc.curlExample, 'curl')"
        >
          <NIcon size="16">
            <CheckmarkOutline v-if="copiedCurl" />
            <CopyOutline v-else />
          </NIcon>
        </button>
        <NCode :code="currentDoc.curlExample" language="bash" />
      </div>
    </div>
  </NModal>
</template>

<style scoped>
.api-doc-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.doc-section-title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  margin: 0;
  padding-left: 10px;
  border-left: 3px solid var(--color-accent-bar);
  color: var(--color-text-primary);
}

.code-block {
  position: relative;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background-color: var(--color-bg-elevated);
}

.code-block :deep(.n-code) pre {
  padding: 12px 16px;
  overflow-x: auto;
  scrollbar-gutter: stable;
}

.copy-btn {
  position: absolute;
  top: 6px;
  right: 6px;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-bg-card);
  color: var(--color-text-secondary);
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s ease, background 0.2s ease;
}

.code-block:hover .copy-btn {
  opacity: 1;
}

.copy-btn:hover {
  background: var(--color-bg-elevated);
}

.param-table :deep(thead th) {
  background-color: var(--color-bg-elevated);
  font-weight: var(--font-weight-semibold);
}
</style>
