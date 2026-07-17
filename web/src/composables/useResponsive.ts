import { ref, onMounted, onUnmounted } from 'vue';

export function useResponsive() {
  const isMobile = ref(window.innerWidth < 768);
  const isTablet = ref(window.innerWidth >= 768 && window.innerWidth < 1024);

  function handleResize() {
    isMobile.value = window.innerWidth < 768;
    isTablet.value = window.innerWidth >= 768 && window.innerWidth < 1024;
  }

  onMounted(() => window.addEventListener('resize', handleResize));
  onUnmounted(() => window.removeEventListener('resize', handleResize));

  return { isMobile, isTablet };
}
