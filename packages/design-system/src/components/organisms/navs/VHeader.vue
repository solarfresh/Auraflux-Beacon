<template>
  <VBox
    tag="header"
    :intent="intent",
    :surface="surface"
    class="min-h-16 w-full sticky top-0 z-50 flex items-center"
  >
    <VCluster
      justify="between"
      align="center"
      class="w-full px-6 max-w-7xl mx-auto h-full"
    >
      <VIdentity :show-back="showBack" :title="title" :section="section" @back="emit('back')" />

      <VBox class="hidden md:flex grow justify-center px-8 max-w-2xl">
        <slot name="center" />
      </VBox>

      <slot name="actions" />
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VIdentity from '@auraflux/design-system/components/molecules/navs/VIdentity.vue';

import type {
  IntentToken,
  SurfaceToken,
} from '@auraflux/design-system/interfaces/theme';

export interface VHeaderProps {
  intent?: IntentToken;
  surface?: SurfaceToken;
  showBack: boolean;
  title: string;
  section?: string;
};

withDefaults(defineProps<VHeaderProps>(), {
  intent: 'brand',
  surface: 'solid',
  showBack: false
});

const emit = defineEmits<{
  (e: 'back'): void;
}>();
</script>

<style scoped>
header :deep(.v-header-content-move) {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>