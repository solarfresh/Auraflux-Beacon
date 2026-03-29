<template>
  <VBox
    tag="header"
    :class="[
      'w-full sticky top-0 z-50 transition-all duration-300',
      variant === 'glass' ? 'backdrop-blur-md bg-white/80' : 'bg-white',
      hasShadow ? 'shadow-sm' : '',
      hasBorder ? 'border-b border-slate-200' : ''
    ]"
    class="min-h-16 flex items-center"
  >
    <VCluster
      justify="between"
      align="center"
      class="w-full px-6 max-w-7xl mx-auto h-full"
    >

      <VCluster gap="md" align="center" class="flex-none min-w-40">
        <slot name="left" />
      </VCluster>

      <VBox class="hidden md:flex grow justify-center px-8 max-w-2xl">
        <slot name="center" />
      </VBox>

      <VCluster gap="md" align="center" justify="end" class="flex-none min-w-40">
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