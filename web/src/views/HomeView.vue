<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { NGrid, NGridItem, NCard, NIcon, NText } from 'naive-ui';
import {
  QrCodeOutline,
  AtOutline,
  KeyOutline,
  ShieldCheckmarkOutline,
  CodeWorkingOutline,
  DocumentTextOutline,
  FingerPrintOutline,
} from '@vicons/ionicons5';
import { useHistory } from '@/composables/useHistory';
import { useResponsive } from '@/composables/useResponsive';
import SectionTitle from '@/components/SectionTitle.vue';
import type { FeatureId } from '@/types';

const router = useRouter();
const { t } = useI18n();
const { getRecentUsage, getFrequentUsage } = useHistory();
const { isMobile } = useResponsive();

interface FeatureCard {
  id: FeatureId;
  icon: any;
  route: string;
  descKey: string;
}

const allFeatures: FeatureCard[] = [
  { id: 'qr', icon: QrCodeOutline, route: '/qr', descKey: 'home.qrDesc' },
  { id: 'uuid', icon: AtOutline, route: '/uuid', descKey: 'home.uuidDesc' },
  { id: 'password', icon: KeyOutline, route: '/password', descKey: 'home.passwordDesc' },
  { id: 'hash', icon: ShieldCheckmarkOutline, route: '/hash', descKey: 'home.hashDesc' },
  { id: 'codec', icon: CodeWorkingOutline, route: '/codec', descKey: 'home.codecDesc' },
  { id: 'file-hash', icon: DocumentTextOutline, route: '/file-hash', descKey: 'home.fileHashDesc' },
  { id: 'token', icon: FingerPrintOutline, route: '/token', descKey: 'home.tokenDesc' },
];

const featureMap = new Map(allFeatures.map((f) => [f.id, f]));

const recentFeatures = computed(() => {
  const ids = getRecentUsage(5);
  return ids.map((id) => featureMap.get(id)).filter(Boolean) as FeatureCard[];
});

const frequentFeatures = computed(() => {
  const ids = getFrequentUsage(5);
  return ids.map((id) => featureMap.get(id)).filter(Boolean) as FeatureCard[];
});

const hasHistory = computed(
  () => recentFeatures.value.length > 0 || frequentFeatures.value.length > 0,
);

function getFeatureName(id: FeatureId): string {
  return t(`nav.${id === 'file-hash' ? 'fileHash' : id}`);
}

function navigateTo(route: string) {
  router.push(route);
}

const gridCols = computed(() => (isMobile.value ? 1 : 2));
</script>

<template>
  <div class="home-view">
    <div class="home-header">
      <h1 class="home-title">{{ t('home.title') }}</h1>
      <p class="home-subtitle">{{ t('home.subtitle') }}</p>
    </div>

    <template v-if="hasHistory">
      <div v-if="recentFeatures.length > 0" class="section-block">
        <SectionTitle :title="t('home.recentUsage')" />
        <NGrid :cols="gridCols" :x-gap="16" :y-gap="16">
          <NGridItem v-for="feature in recentFeatures" :key="feature.id">
            <NCard hoverable class="feature-card interactive" @click="navigateTo(feature.route)">
              <div class="card-content">
                <div class="card-icon-wrap">
                  <NIcon size="24" class="card-icon">
                    <component :is="feature.icon" />
                  </NIcon>
                </div>
                <div class="card-text">
                  <NText class="card-label">{{ getFeatureName(feature.id) }}</NText>
                  <NText class="card-desc">{{ t(feature.descKey) }}</NText>
                </div>
              </div>
            </NCard>
          </NGridItem>
        </NGrid>
      </div>

      <div v-if="frequentFeatures.length > 0" class="section-block">
        <SectionTitle :title="t('home.frequentUsage')" />
        <NGrid :cols="gridCols" :x-gap="16" :y-gap="16">
          <NGridItem v-for="feature in frequentFeatures" :key="feature.id">
            <NCard hoverable class="feature-card interactive" @click="navigateTo(feature.route)">
              <div class="card-content">
                <div class="card-icon-wrap">
                  <NIcon size="24" class="card-icon">
                    <component :is="feature.icon" />
                  </NIcon>
                </div>
                <div class="card-text">
                  <NText class="card-label">{{ getFeatureName(feature.id) }}</NText>
                  <NText class="card-desc">{{ t(feature.descKey) }}</NText>
                </div>
              </div>
            </NCard>
          </NGridItem>
        </NGrid>
      </div>
    </template>

    <div class="section-block">
      <SectionTitle :title="t('home.allTools')" />
      <NGrid :cols="gridCols" :x-gap="16" :y-gap="16">
      <NGridItem v-for="feature in allFeatures" :key="feature.id">
        <NCard hoverable class="feature-card interactive" @click="navigateTo(feature.route)">
          <div class="card-content">
            <div class="card-icon-wrap">
              <NIcon size="24" class="card-icon">
                <component :is="feature.icon" />
              </NIcon>
            </div>
            <div class="card-text">
              <NText class="card-label">{{ getFeatureName(feature.id) }}</NText>
              <NText class="card-desc">{{ t(feature.descKey) }}</NText>
            </div>
          </div>
        </NCard>
      </NGridItem>
    </NGrid>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  max-width: 800px;
  margin: 0 auto;
}

.home-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.section-block {
  margin-bottom: var(--spacing-xl);
}

.section-block:last-child {
  margin-bottom: 0;
}

.home-title {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-extrabold);
  letter-spacing: -1px;
  margin: 0 0 var(--spacing-sm) 0;
  color: var(--color-text-primary);
}

.home-subtitle {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  margin: 0;
}

.feature-card {
  cursor: pointer;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
}

.card-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.card-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md);
  background-color: var(--color-bg-elevated);
  flex-shrink: 0;
}

.card-icon {
  color: var(--color-cta);
}

.card-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.card-label {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
}

.card-desc {
  font-size: var(--font-size-caption);
  color: var(--color-text-secondary);
}
</style>
