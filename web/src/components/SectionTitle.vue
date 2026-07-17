<script setup lang="ts">
defineProps<{
  title: string;
}>();
</script>

<template>
  <div class="section-title">
    <span class="section-title__bar" />
    <h3 class="section-title__text">{{ title }}</h3>
  </div>
</template>

<style scoped>
.section-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.section-title__bar {
  width: 3px;
  height: 20px;
  border-radius: 2px;
  background-color: var(--color-accent-bar);
  flex-shrink: 0;
}

.section-title__text {
  font-size: var(--font-size-h4);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
  line-height: var(--line-height-tight);
}
</style>
