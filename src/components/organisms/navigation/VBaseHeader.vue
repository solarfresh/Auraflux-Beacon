<template>
  <VBox
    tag="header"
    :class="[
      'w-full sticky top-0 z-50 transition-all duration-300',
      variant === 'glass' ? 'backdrop-blur-md bg-white/80' : 'bg-white',
      hasShadow ? 'shadow-sm' : '',
      hasBorder ? 'border-b border-slate-200' : ''
    ]"
    height="16"
  >
    <VCluster
      justify="between"
      align="center"
      class="h-full px-6 max-w-[1920px] mx-auto"
    >

      <VCluster gap="md" align="center" class="flex-1 shrink-0">
        <slot name="left" />
      </VCluster>

      <VBox class="hidden md:flex flex-1 justify-center">
        <slot name="center" />
      </VBox>

      <VCluster gap="md" align="center" justify="end" class="flex-1 shrink-0">
        <slot name="right" />
      </VCluster>

    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';

withDefaults(defineProps<{
  variant?: 'solid' | 'glass';
  hasShadow?: boolean;
  hasBorder?: boolean;
}>(), {
  variant: 'solid',
  hasShadow: false,
  hasBorder: true
});
</script>

<style scoped>
/* Ensure seamless transition when slot content changes */
header :deep(.v-header-content-move) {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>