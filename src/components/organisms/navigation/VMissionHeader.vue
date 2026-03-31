<template>
  <VBaseHeader
    variant="glass"
    :has-border="true"
    class="bg-white/90"
  >
    <template #left>
      <VCluster gap="sm" align="center">
        <VButton
          variant="tertiary"
          size="sm"
          icon-name="ArrowLeft"
          icon-only
          @click="handleBack"
        />
        <VBox width="px" height="4" background="slate-50" />
        <VStack gap="none">
          <VTypography size="xs" weight="bold" color="indigo-600" class="uppercase">
            Mission
          </VTypography>
          <VTypography size="sm" weight="semibold" color="slate-900">
            {{ title }}
          </VTypography>
        </VStack>
      </VCluster>
    </template>

    <template #center>
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
  </VBaseHeader>
</template>

<script setup lang="ts">
/**
 * VMissionHeader (Stage-Switching Edition)
 * Replaces search with a segmented control to navigate through ISP-inspired phases.
 */
import VButton from '@/components/atoms/buttons/VButton.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VBaseHeader from '@/components/organisms/navigation/VBaseHeader.vue';
import type { ISPStage } from '@/interfaces/project';
import { useProjectStore } from '@/stores/project';
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const projectStore = useProjectStore();

const stageLabels = ref<string[]>(['Initiation', 'Exploration', 'Synthesis']);

const currentProjectId = computed(() => projectStore.currentProjectId);
const currentStage = computed(() => projectStore.currentStage);
const title = computed(() => projectStore.projectName);

const changeStage = (stage: ISPStage) => {
  if (stage === 'SYNTHESIS') return;
  router.push(`/isearch/${currentProjectId.value}/${stage.toLowerCase()}/`);
};

const handleBack = () => {
  // Navigate back to the project list or previous context
  router.push({ name: 'ProjectPage' });
};
</script>