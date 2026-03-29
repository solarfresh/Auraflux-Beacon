<template>
  <VBox
    tag="article"
    :background="isAIGenerated ? 'amber-50' : 'white'"
    :hover-background="isAIGenerated ? 'amber-50' : 'slate-50'"
    :border="isAIGenerated ? 'dashed' : 'all'"
    padding="md"
    rounded="xl"
    :clickable="true"
    class="w-full h-full flex flex-col group shadow-sm hover:shadow-md transition-all duration-300"
  >
    <VStack gap="md" full-height>
      <VCluster justify="between" align="start">
        <VBox
          padding="xs"
          rounded="lg"
          :background="isAIGenerated ? 'white' : 'indigo-50'"
          class="shrink-0"
        >
          <VIcon
            :name="isAIGenerated ? 'Sparkles' : 'Folder'"
            :color="isAIGenerated ? 'amber-600' : 'indigo-600'"
          />
        </VBox>

        <slot name="actions" />
      </VCluster>

      <VStack gap="xs">
        <VTypography weight="bold" size="md" class="line-clamp-1 group-hover:text-indigo-700 transition-colors">
          {{ project.name }}
        </VTypography>
        <VTypography size="sm" color="slate-500" class="line-clamp-2 min-h-[2.5rem]">
          {{ project.description || 'No description provided.' }}
        </VTypography>
      </VStack>

      <VSpacer />

      <VCluster gap="xs" wrap justify="between" align="center" class="pt-2 border-t border-slate-100/50">
        <VCluster gap="xs">
          <VEntityChip
            v-for="tag in project.tags?.slice(0, 2)"
            :key="tag"
            size="xs"
            :label="tag"
          />
          <VTypography v-if="project.tags?.length > 2" size="xs" color="slate-400">
            +{{ project.tags.length - 2 }}
          </VTypography>
        </VCluster>

        <VTypography size="xs" color="slate-400" weight="medium">
          {{ lastModifiedDate }}
        </VTypography>
      </VCluster>
    </VStack>
  </VBox>
</template>

<script setup lang="ts">
/**
 * VProjectCard
 * A business molecule representing a single project entity.
 * It maps domain-specific states (AI-generated vs. Manual) to visual tokens.
 * * @category Molecules
 * @subcategory Business
 */
import { computed } from 'vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VSpacer from '@/components/atoms/layout/VSpacer.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VEntityChip from '@/components/molecules/resources/VEntityChip.vue';
import type { Project } from '@/interfaces/project';

const props = defineProps<{
  /** The project data object */
  project: Project;
}>();

/**
 * Semantic mapping:
 * AI-generated projects receive different background and border tokens.
 */
const isAIGenerated = computed(() => props.project.status === 'AI_EXTRACTED');

/**
 * Simple date formatter for the metadata area.
 */
const lastModifiedDate = computed(() => {
  const date = new Date(props.project.updatedAt);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
});
</script>