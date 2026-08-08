<template>
  <VBox
    tag="header"
    intent="brand",
    surface="solid"
    class="min-h-16 w-full sticky top-0 z-50 flex items-center"
  >
    <VCluster
      justify="between"
      align="center"
      class="w-full px-6 max-w-7xl mx-auto h-full"
    >
      <VHeaderIdentity />

      <VBox class="hidden md:flex grow justify-center px-8 max-w-2xl">
        <VWorkspaceBar v-if="isWorkingContext" />
        <!-- <VGlobalSearch v-else /> -->
      </VBox>

      <VHeaderActions />
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VGlobalSearch from '@/components/molecules/forms/VGlobalSearch.vue';
import VHeaderActions from '@/components/organisms/navigation/VHeaderActions.vue';
import VHeaderIdentity from '@/components/organisms/navigation/VHeaderIdentity.vue';
import VWorkspaceBar from '@/components/organisms/navigation/VWorkspaceBar.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

withDefaults(defineProps<{}>(), {});

// Check if we are in a project-specific workspace
const isWorkingContext = computed(() =>
  ['ConsultationPage', 'ExplorationPage'].includes(route.name as string)
);
</script>

<style scoped>
header :deep(.v-header-content-move) {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>