<template>
  <VBox
    background="slate-50"
    padding="xs"
    rounded="lg"
    class="border border-slate-200/60 inline-flex items-center"
  >
    <VCluster gap="xs">
      <VButton
        v-for="label in stageLabels"
        :variant="currentStage === label.toUpperCase() ? 'primary' : 'tertiary'"
        size="xs"
        class="px-4 py-1.5"
        @click="changeStage(label.toUpperCase() as ISPStage)"
      >
        {{ label }}
      </VButton>
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
import VButton from '@/components/atoms/buttons/VButton.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import type { ISPStage } from '@/interfaces/project';
import { useProjectStore } from '@/stores/project';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const projectStore = useProjectStore();

const stageLabels = ref<string[]>(['Initiation', 'Exploration', 'Synthesis']);

const currentProjectId = computed(() => projectStore.currentProjectId);
const currentStage = computed(() => projectStore.currentStage);

const changeStage = (stage: ISPStage) => {
  if (stage === 'SYNTHESIS') return;
  router.push(`/isearch/${currentProjectId.value}/${stage.toLowerCase()}/`);
};
</script>