<script setup lang="ts">
import { computed, h, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import {
  NLayout,
  NLayoutSider,
  NLayoutContent,
  NMenu,
  NButton,
  NSpace,
  NIcon,
  NTooltip,
  NDropdown,
} from 'naive-ui';
import {
  HomeOutline,
  QrCodeOutline,
  KeyOutline,
  ShieldCheckmarkOutline,
  CodeWorkingOutline,
  DocumentTextOutline,
  FingerPrintOutline,
  AtOutline,
  SunnyOutline,
  MoonOutline,
  LanguageOutline,
} from '@vicons/ionicons5';
import { useThemeStore } from '@/stores/theme';
import { useLocaleStore } from '@/stores/locale';

const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();
const themeStore = useThemeStore();
const localeStore = useLocaleStore();
const collapsed = ref(false);

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const menuOptions = computed(() => [
  { label: t('nav.home'), key: '/', icon: renderIcon(HomeOutline) },
  { label: t('nav.qr'), key: '/qr', icon: renderIcon(QrCodeOutline) },
  { label: t('nav.uuid'), key: '/uuid', icon: renderIcon(AtOutline) },
  {
    label: t('nav.password'),
    key: '/password',
    icon: renderIcon(KeyOutline),
  },
  {
    label: t('nav.hash'),
    key: '/hash',
    icon: renderIcon(ShieldCheckmarkOutline),
  },
  {
    label: t('nav.codec'),
    key: '/codec',
    icon: renderIcon(CodeWorkingOutline),
  },
  {
    label: t('nav.fileHash'),
    key: '/file-hash',
    icon: renderIcon(DocumentTextOutline),
  },
  {
    label: t('nav.token'),
    key: '/token',
    icon: renderIcon(FingerPrintOutline),
  },
]);

const activeKey = computed(() => route.path);

function handleMenuUpdate(key: string) {
  router.push(key);
}

const localeOptions = computed(() => [
  { label: '中文', key: 'zh-CN' },
  { label: 'English', key: 'en-US' },
]);

function handleLocaleSelect(key: string) {
  localeStore.setLocale(key);
  locale.value = key;
}
</script>

<template>
  <NLayout has-sider class="app-layout">
    <NLayoutSider
      bordered
      :collapsed="collapsed"
      collapse-mode="width"
      :collapsed-width="64"
      :width="220"
      show-trigger
      @collapse="collapsed = true"
      @expand="collapsed = false"
      :native-scrollbar="false"
      class="app-sider"
    >
      <div class="sider-header">
        <h1 v-if="!collapsed" class="app-title">{{ t('home.title') }}</h1>
        <span v-else class="app-title-mini">DK</span>
      </div>
      <NMenu
        :collapsed="collapsed"
        :collapsed-width="64"
        :collapsed-icon-size="22"
        :options="menuOptions"
        :value="activeKey"
        @update:value="handleMenuUpdate"
      />
    </NLayoutSider>
    <NLayoutContent class="app-content" content-style="padding: 24px;">
      <div class="content-header">
        <div class="header-spacer" />
        <NSpace align="center" :size="12">
          <NTooltip trigger="hover">
            <template #trigger>
              <NButton quaternary circle @click="themeStore.toggleTheme()">
                <template #icon>
                  <NIcon size="20">
                    <SunnyOutline v-if="themeStore.isDark" />
                    <MoonOutline v-else />
                  </NIcon>
                </template>
              </NButton>
            </template>
            {{ themeStore.isDark ? t('theme.light') : t('theme.dark') }}
          </NTooltip>
          <NDropdown
            :options="localeOptions"
            @select="handleLocaleSelect"
            trigger="click"
          >
            <NButton quaternary circle>
              <template #icon>
                <NIcon size="20">
                  <LanguageOutline />
                </NIcon>
              </template>
            </NButton>
          </NDropdown>
        </NSpace>
      </div>
      <router-view />
    </NLayoutContent>
  </NLayout>
</template>

<style scoped>
.app-layout {
  height: 100%;
}

.app-sider {
  height: 100%;
}

.sider-header {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 56px;
  border-bottom: 1px solid var(--n-border-color);
}

.app-title {
  font-size: 20px;
  font-weight: 700;
  letter-spacing: -0.5px;
  margin: 0;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-title-mini {
  font-size: 18px;
  font-weight: 800;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.app-content {
  height: 100%;
}
:deep(.n-layout),
:deep(.n-layout-scroll-container) {
  height: 100%;
}

.content-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-bottom: 16px;
}

.header-spacer {
  flex: 1;
}
</style>
