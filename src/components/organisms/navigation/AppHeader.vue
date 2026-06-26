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
      <VHeaderIdentity />

      <VBox class="hidden md:flex grow justify-center px-8 max-w-2xl">
        <VWorkspaceBar v-if="isWorkingContext" />
        <VGlobalSearch v-else />
      </VBox>

      <VHeaderActions />
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VGlobalSearch from '@/components/molecules/forms/VGlobalSearch.vue';
import VHeaderActions from '@/components/organisms/navigation/VHeaderActions.vue';
import VHeaderIdentity from '@/components/organisms/navigation/VHeaderIdentity.vue';
import VWorkspaceBar from '@/components/organisms/navigation/VWorkspaceBar.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

withDefaults(defineProps<{
  variant?: 'solid' | 'glass';
  hasShadow?: boolean;
  hasBorder?: boolean;
}>(), {
  variant: 'solid',
  hasShadow: false,
  hasBorder: true
});

// Check if we are in a project-specific workspace
const isWorkingContext = computed(() =>
  ['InitiationPage', 'ExplorationPage'].includes(route.name as string)
);
</script>

<style scoped>
header :deep(.v-header-content-move) {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>