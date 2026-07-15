<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { NGrid, NGridItem, NCard, NIcon, NText, NDivider } from 'naive-ui';
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
import type { FeatureId } from '@/types';

const router = useRouter();
const { t } = useI18n();
const { getRecentUsage, getFrequentUsage } = useHistory();

interface FeatureCard {
  id: FeatureId;
  icon: any;
  route: string;
}

const allFeatures: FeatureCard[] = [
  { id: 'qr', icon: QrCodeOutline, route: '/qr' },
  { id: 'uuid', icon: AtOutline, route: '/uuid' },
  { id: 'password', icon: KeyOutline, route: '/password' },
  { id: 'hash', icon: ShieldCheckmarkOutline, route: '/hash' },
  { id: 'codec', icon: CodeWorkingOutline, route: '/codec' },
  { id: 'file-hash', icon: DocumentTextOutline, route: '/file-hash' },
  { id: 'token', icon: FingerPrintOutline, route: '/token' },
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
</script>

<template>
  <div class="home-view">
    <div class="home-header">
      <h1 class="home-title">{{ t('home.title') }}</h1>
      <p class="home-subtitle">{{ t('home.subtitle') }}</p>
    </div>

    <template v-if="hasHistory">
      <NDivider v-if="recentFeatures.length > 0">{{ t('home.recentUsage') }}</NDivider>
      <NGrid :cols="2" :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
        <NGridItem v-for="feature in recentFeatures" :key="feature.id" span="0:2 640:1">
          <NCard hoverable class="feature-card" @click="navigateTo(feature.route)">
            <div class="card-content">
              <NIcon size="32" class="card-icon">
                <component :is="feature.icon" />
              </NIcon>
              <NText class="card-label">{{ getFeatureName(feature.id) }}</NText>
            </div>
          </NCard>
        </NGridItem>
      </NGrid>

      <NDivider v-if="frequentFeatures.length > 0">{{ t('home.frequentUsage') }}</NDivider>
      <NGrid :cols="2" :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
        <NGridItem v-for="feature in frequentFeatures" :key="feature.id" span="0:2 640:1">
          <NCard hoverable class="feature-card" @click="navigateTo(feature.route)">
            <div class="card-content">
              <NIcon size="32" class="card-icon">
                <component :is="feature.icon" />
              </NIcon>
              <NText class="card-label">{{ getFeatureName(feature.id) }}</NText>
            </div>
          </NCard>
        </NGridItem>
      </NGrid>
    </template>

    <NDivider>{{ t('home.allTools') }}</NDivider>
    <NGrid :cols="2" :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
      <NGridItem v-for="feature in allFeatures" :key="feature.id" span="0:2 640:1">
        <NCard hoverable class="feature-card" @click="navigateTo(feature.route)">
          <div class="card-content">
            <NIcon size="32" class="card-icon">
              <component :is="feature.icon" />
            </NIcon>
            <NText class="card-label">{{ getFeatureName(feature.id) }}</NText>
          </div>
        </NCard>
      </NGridItem>
    </NGrid>
  </div>
</template>

<style scoped>
.home-view {
  max-width: 800px;
  margin: 0 auto;
}

.home-header {
  text-align: center;
  margin-bottom: 32px;
}

.home-title {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -1px;
  margin: 0 0 8px;
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.home-subtitle {
  font-size: 16px;
  opacity: 0.6;
  margin: 0;
}

.feature-card {
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-2px);
}

.card-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  color: #6366f1;
  flex-shrink: 0;
}

.card-label {
  font-size: 16px;
  font-weight: 500;
}
</style>
