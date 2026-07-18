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
  NDrawer,
  NDrawerContent,
} from 'naive-ui';
import {
  HomeOutline,
  QrCodeOutline,
  KeyOutline,
  ShieldCheckmarkOutline,
  CodeWorkingOutline,
  FingerPrintOutline,
  AtOutline,
  SunnyOutline,
  MoonOutline,
  LanguageOutline,
  MenuOutline,
  LockClosedOutline,
} from '@vicons/ionicons5';
import { useThemeStore } from '@/stores/theme';
import { useLocaleStore } from '@/stores/locale';
import { useResponsive } from '@/composables/useResponsive';

const router = useRouter();
const route = useRoute();
const { t, locale } = useI18n();
const themeStore = useThemeStore();
const localeStore = useLocaleStore();
const collapsed = ref(false);
const drawerShow = ref(false);
const { isMobile } = useResponsive();

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
    label: t('nav.digest'),
    key: '/digest',
    icon: renderIcon(ShieldCheckmarkOutline),
  },
  {
    label: t('nav.codec'),
    key: '/codec',
    icon: renderIcon(CodeWorkingOutline),
  },
  {
    label: t('nav.token'),
    key: '/token',
    icon: renderIcon(FingerPrintOutline),
  },
  {
    label: t('nav.asymmetric'),
    key: '/asymmetric',
    icon: renderIcon(LockClosedOutline),
  },
]);

const activeKey = computed(() => route.path);

function handleMenuUpdate(key: string) {
  router.push(key);
  // 移动端选择菜单项后关闭抽屉
  if (isMobile.value) {
    drawerShow.value = false;
  }
}

const localeOptions = computed(() => [
  { label: '中文', key: 'zh-cn' },
  { label: 'English', key: 'en-us' },
]);

function handleLocaleSelect(key: string) {
  localeStore.setLocale(key);
  locale.value = key;
}
</script>

<template>
  <!-- 桌面端布局 -->
  <NLayout v-if="!isMobile" has-sider class="app-layout">
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
        <h1 v-if="!collapsed" class="app-title">DevKitly</h1>
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
              <NButton
                quaternary
                circle
                class="interactive"
                aria-label="切换主题"
                @click="themeStore.toggleTheme()"
              >
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
            <NButton quaternary circle class="interactive" aria-label="切换语言">
              <template #icon>
                <NIcon size="20">
                  <LanguageOutline />
                </NIcon>
              </template>
            </NButton>
          </NDropdown>
        </NSpace>
      </div>
      <div class="content-body">
        <router-view v-slot="{ Component }">
          <Transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </div>
    </NLayoutContent>
  </NLayout>

  <!-- 移动端布局 -->
  <NLayout v-else class="app-layout">
    <NLayoutContent class="app-content" content-style="padding: 16px;">
      <div class="mobile-header">
        <NButton quaternary circle class="interactive" aria-label="打开导航菜单" @click="drawerShow = true">
          <template #icon>
            <NIcon size="20">
              <MenuOutline />
            </NIcon>
          </template>
        </NButton>
        <span class="mobile-title">DevKitly</span>
        <NSpace align="center" :size="8">
          <NButton
            quaternary
            circle
            size="small"
            class="interactive"
            aria-label="切换主题"
            @click="themeStore.toggleTheme()"
          >
            <template #icon>
              <NIcon size="18">
                <SunnyOutline v-if="themeStore.isDark" />
                <MoonOutline v-else />
              </NIcon>
            </template>
          </NButton>
          <NDropdown
            :options="localeOptions"
            @select="handleLocaleSelect"
            trigger="click"
          >
            <NButton quaternary circle size="small" class="interactive" aria-label="切换语言">
              <template #icon>
                <NIcon size="18">
                  <LanguageOutline />
                </NIcon>
              </template>
            </NButton>
          </NDropdown>
        </NSpace>
      </div>
      <div class="content-body">
        <router-view v-slot="{ Component }">
          <Transition name="fade-slide" mode="out-in">
            <component :is="Component" />
          </Transition>
        </router-view>
      </div>
    </NLayoutContent>

    <NDrawer v-model:show="drawerShow" placement="left" :width="280">
      <NDrawerContent :title="'DevKitly'" :native-scrollbar="false">
        <NMenu
          :options="menuOptions"
          :value="activeKey"
          @update:value="handleMenuUpdate"
        />
      </NDrawerContent>
    </NDrawer>
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
  border-bottom: 1px solid var(--color-border);
}

.app-title {
  font-size: 20px;
  font-weight: var(--font-weight-bold);
  letter-spacing: -0.5px;
  margin: 0;
  color: var(--color-cta);
}

.app-title-mini {
  font-size: 18px;
  font-weight: var(--font-weight-extrabold);
  color: var(--color-cta);
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
  margin-bottom: var(--spacing-md);
}

.header-spacer {
  flex: 1;
}

.content-body {
  max-width: 900px;
  margin: 0 auto;
}

/* 移动端顶栏 */
.mobile-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.mobile-title {
  flex: 1;
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-bold);
  color: var(--color-cta);
}
</style>
