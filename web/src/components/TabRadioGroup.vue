<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onUnmounted, computed } from 'vue';

export interface TabRadioGroupOption {
  label: string;
  value: string;
}

interface TabRadioGroupProps {
  options: TabRadioGroupOption[];
  modelValue: string;
  ariaLabel?: string;
}

const props = defineProps<TabRadioGroupProps>();
const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void;
}>();

const containerRef = ref<HTMLDivElement | null>(null);
const itemRefs = ref<HTMLDivElement[]>([]);
const isFirstRender = ref(true);

const indicatorStyle = ref<Record<string, string>>({
  opacity: '0',
  transform: 'translateX(0)',
  width: '0',
});

const selectedIndex = computed(() =>
  props.options.findIndex((opt) => opt.value === props.modelValue),
);

function updateIndicatorPosition() {
  if (!containerRef.value || selectedIndex.value === -1) {
    indicatorStyle.value = { opacity: '0', transform: 'translateX(0)', width: '0' };
    return;
  }

  const containerRect = containerRef.value.getBoundingClientRect();
  const item = itemRefs.value[selectedIndex.value];
  if (!item) return;

  const itemRect = item.getBoundingClientRect();
  const offsetX = itemRect.left - containerRect.left;

  indicatorStyle.value = {
    opacity: '1',
    width: `${itemRect.width}px`,
    transform: `translateX(${offsetX}px)`,
  };
}

function selectOption(value: string) {
  emit('update:modelValue', value);
}

function handleKeydown(event: KeyboardEvent) {
  const currentIndex = props.options.findIndex((opt) => opt.value === props.modelValue);
  let newIndex = currentIndex;

  switch (event.key) {
    case 'ArrowLeft':
      newIndex = currentIndex <= 0 ? props.options.length - 1 : currentIndex - 1;
      break;
    case 'ArrowRight':
      newIndex = currentIndex >= props.options.length - 1 ? 0 : currentIndex + 1;
      break;
    case ' ':
    case 'Enter':
      event.preventDefault();
      return;
    default:
      return;
  }

  event.preventDefault();
  const newValue = props.options[newIndex].value;
  emit('update:modelValue', newValue);

  nextTick(() => {
    itemRefs.value[newIndex]?.focus();
  });
}

let resizeObserver: ResizeObserver | null = null;

onMounted(() => {
  nextTick(() => {
    updateIndicatorPosition();
    requestAnimationFrame(() => {
      isFirstRender.value = false;
    });
  });

  if (containerRef.value) {
    resizeObserver = new ResizeObserver(() => {
      updateIndicatorPosition();
    });
    resizeObserver.observe(containerRef.value);
  }
});

onUnmounted(() => {
  resizeObserver?.disconnect();
});

watch(() => props.modelValue, () => {
  nextTick(() => updateIndicatorPosition());
});

watch(() => props.options, () => {
  nextTick(() => updateIndicatorPosition());
}, { deep: true });
</script>

<template>
  <div
    ref="containerRef"
    class="tab-radio-group"
    role="radiogroup"
    :aria-label="ariaLabel"
  >
    <div
      class="tab-radio-group__indicator"
      :class="{ 'tab-radio-group__indicator--animated': !isFirstRender }"
      :style="indicatorStyle"
    />
    <div
      v-for="(option, index) in options"
      :key="option.value"
      :ref="(el) => { if (el) itemRefs[index] = el as HTMLDivElement; }"
      class="tab-radio-group__item"
      :class="{ 'tab-radio-group__item--active': modelValue === option.value }"
      role="radio"
      :aria-checked="modelValue === option.value"
      :tabindex="modelValue === option.value ? 0 : -1"
      @click="selectOption(option.value)"
      @keydown="handleKeydown"
    >
      <span class="tab-radio-group__label">{{ option.label }}</span>
    </div>
  </div>
</template>

<style scoped>
.tab-radio-group {
  position: relative;
  display: inline-flex;
  align-items: center;
  background-color: var(--color-bg-elevated);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs) var(--spacing-sm);
  gap: var(--spacing-xs);
}

.tab-radio-group__indicator {
  position: absolute;
  top: var(--spacing-xs);
  left: 0;
  height: calc(100% - var(--spacing-xs) * 2);
  background-color: var(--color-bg-card);
  border-radius: var(--radius-sm);
  box-shadow: var(--shadow-sm);
  z-index: 0;
}

.tab-radio-group__indicator--animated {
  transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1),
              width 300ms cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-radio-group__item {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px 20px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  user-select: none;
  color: var(--color-text-secondary);
  transition: color 0.2s ease, background-color 0.2s ease;
  z-index: 1;
}

.tab-radio-group__item--active {
  color: var(--color-cta);
  font-weight: var(--font-weight-semibold);
}

.tab-radio-group__item:not(.tab-radio-group__item--active):hover {
  background-color: var(--color-bg-card);
}

.tab-radio-group__item:focus-visible {
  outline: 2px solid var(--color-cta);
  outline-offset: -2px;
}

.tab-radio-group__label {
  white-space: nowrap;
}

@media (max-width: 767px) {
  .tab-radio-group {
    display: flex;
    width: 100%;
  }

  .tab-radio-group__item {
    flex: 1;
    min-height: 44px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .tab-radio-group__indicator--animated {
    transition: none;
  }

  .tab-radio-group__item {
    transition: none;
  }
}
</style>
