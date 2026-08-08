<template>
  <VCard
    tag="article"
    :intent="isAIGenerated ? 'warning' : 'neutral'"
    :surface="isAIGenerated ? 'soft' : (surface || 'base')"
    :border="isAIGenerated ? 'dashed' : (border || 'none')"
    :padding="padding"
    :rounded="rounded"
    :clickable="clickable"
    :hoverable="hoverable"
    class="group relative transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
  >
    <VStack gap="md">
      <VCluster justify="between" align="center">
        <VCluster gap="xs" align="center">
          <VBox
            padding="xs"
            rounded="md"
            :intent="isAIGenerated ? 'warning' : 'brand'"
            surface="soft"
            class="flex items-center justify-center shrink-0"
          >
            <VIcon
              :name="isAIGenerated ? 'Sparkles' : 'Folder'"
              size="sm"
            />
          </VBox>

          <VStack gap="none" class="hidden sm:flex">
            <VTypography
              tag="span"
              size="xs"
              weight="bold"
              :intent="isAIGenerated ? 'warning' : 'brand'"
              class="uppercase tracking-wider text-[10px]"
            >
              ISP Stage
            </VTypography>
            <VTypography tag="span" size="xs" weight="bold">
              {{ project.currentStage || 'Consultation' }}
            </VTypography>
          </VStack>
        </VCluster>

        <slot name="actions" />
      </VCluster>

      <VStack gap="xs">
        <VTypography
          weight="bold"
          size="md"
          class="line-clamp-1 group-hover:text-indigo-600 transition-colors"
        >
          {{ project.name }}
        </VTypography>
        <VTypography
          size="sm"
          intent="neutral"
          surface="ghost"
          class="line-clamp-2 min-h-10"
        >
          {{ project.description || 'No description provided.' }}
        </VTypography>
      </VStack>

      <VDivider
        orientation="horizontal"
        size="full"
        class="drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] opacity-40"
      />

      <VCluster
        gap="xs"
        wrap
        justify="between"
        align="center"
      >
        <VCluster gap="xs" align="center">
          <VEntityChip
            v-for="tag in project.tags?.slice(0, 2)"
            :key="tag"
            size="xs"
            :label="tag"
          />
          <VTypography
            v-if="project.tags?.length > 2"
            size="xs"
            intent="neutral"
            surface="ghost"
            weight="medium"
          >
            +{{ project.tags.length - 2 }}
          </VTypography>
        </VCluster>

        <VTypography size="xs" intent="neutral" surface="ghost" weight="medium">
          {{ lastModifiedDate }}
        </VTypography>
      </VCluster>
    </VStack>
  </VCard>
</template>

<script setup lang="ts">
/**
 * VProjectCard
 * A business molecule representing a single project entity.
 * Maps domain-specific states (AI-generated vs. Manual) to design tokens.
 */
import { computed } from 'vue';
import VCard from '@auraflux/design-system/components/molecules/resources/VCard.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VDivider from '@auraflux/design-system/components/atoms/layout/VDivider.vue';
import VEntityChip from '@/components/molecules/resources/VEntityChip.vue';

import type {
  AttentionToken,
  BorderToken,
  GapSizeToken,
  IntentToken,
  RoundedToken,
  SpacingToken,
  SurfaceToken,
} from '@auraflux/design-system/interfaces/theme';
import type { Project } from '@/interfaces/project';

export interface VProjectCardProps {
  padding?: SpacingToken;
  rounded?: RoundedToken;
  border?: BorderToken;
  attention?: AttentionToken;
  intent?: IntentToken;
  surface?: SurfaceToken;
  gap?: GapSizeToken;
  clickable?: boolean;
  hoverable?: boolean;
  /** The project data object */
  project: Project;
}

const props = withDefaults(defineProps<VProjectCardProps>(), {
  padding: 'md',
  rounded: 'xl',
  clickable: true,
  hoverable: true,
});

const isAIGenerated = computed(() => props.project.status === 'AI_EXTRACTED');

const lastModifiedDate = computed(() => {
  if (!props.project.updatedAt) return '';
  const date = new Date(props.project.updatedAt);
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
});
</script>