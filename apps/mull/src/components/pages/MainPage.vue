<template>
  <VBox tag="main" class="w-full min-h-screen">
    <VBox intent="neutral" surface="base" padding="lg" class="max-w-5xl mx-auto w-full">
      <VStack gap="lg">
        <PropositionInitializerCard />
      </VStack>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import { watch } from 'vue';
import { useRoute } from 'vue-router'
import { useProjectStore } from '@/stores/project';

import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import PropositionInitializerCard from '@/components/organisms/propositions/PropositionInitializerCard.vue';

const route = useRoute()
const projectStore = useProjectStore();

watch(
  () => route.params.id,
  (newProjectId, oldProjectId) => {
    if (newProjectId && newProjectId !== oldProjectId) {
      if (!Array.isArray(newProjectId)) {
        projectStore.setCurrentProjectId(newProjectId);
      }
    }
  },
  { immediate: true }
)
</script>