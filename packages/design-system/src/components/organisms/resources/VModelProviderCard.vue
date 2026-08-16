<template>
  <VCard
    tag="article"
    :intent="statusConfig.cardIntent"
    :surface="surface || 'base'"
    :border="border || 'none'"
    :padding="padding"
    :rounded="rounded"
    :clickable="clickable"
    :hoverable="hoverable"
    class="group relative transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5"
  >
    <VStack gap="md">
      <!-- 1. Header: SectionHeader with Provider Info and Action Slot -->
      <VCluster justify="between" align="center">
        <VSectionHeader
          icon="Server"
          size="md"
          weight="bold"
          :intent="statusConfig.iconIntent"
          surface="soft"
        >
          <VStack gap="none">
            <VTypography weight="bold" size="md" class="line-clamp-1 transition-colors">
              {{ provider.name }}
            </VTypography>
            <VCluster gap="xs" align="center">
              <VTypography size="xs" intent="neutral" surface="ghost" class="font-mono uppercase">
                {{ provider.type }}
              </VTypography>
              <VTypography size="xs" intent="neutral" surface="ghost">•</VTypography>
              <VTypography size="xs" intent="neutral" surface="ghost" class="font-mono">
                {{ provider.apiKeyFingerprint }}
              </VTypography>
            </VCluster>
          </VStack>

          <template #extra>
            <slot name="actions" />
          </template>
        </VSectionHeader>
      </VCluster>

      <!-- 2. Metadata: Base URL & Metrics -->
      <VCluster justify="between" align="center">
        <VTypography
          size="xs"
          intent="neutral"
          surface="ghost"
          class="font-mono truncate min-h-5"
        >
          {{ provider.baseUrl || 'https://api.openai.com/v1' }}
        </VTypography>

        <VCluster gap="xs" align="center">
          <VIcon name="Zap" size="xs" />
          <VTypography size="xs" weight="medium">
            {{ provider.latencyMs != null ? `${provider.latencyMs} ms` : 'N/A' }}
          </VTypography>
        </VCluster>
      </VCluster>

      <VDivider
        orientation="horizontal"
        size="full"
        class="drop-shadow-[0_1px_1px_rgba(0,0,0,0.05)] opacity-40"
      />

      <!-- 3. Footer: Supported Model Families & Status Badge -->
      <VCluster gap="xs" wrap justify="between" align="center">
        <VCluster gap="xs" align="center">
          <VChip
            v-for="family in (isExpanded ? provider.supportedFamilies : provider.supportedFamilies?.slice(0, 2))"
            intent="neutral"
            surface="soft"
            :key="family.id"
            size="xs"
            :label="family.displayName"
          />
          <VTypography
            v-if="provider.supportedFamilies?.length > 2"
            size="xs"
            intent="neutral"
            surface="ghost"
            weight="medium"
            class="cursor-pointer select-none"
            @click.stop="isExpanded = !isExpanded"
          >
            {{ isExpanded ? 'Less' : `+${provider.supportedFamilies.length - 2}` }}
          </VTypography>
        </VCluster>

        <VChip
          :intent="statusConfig.chipIntent"
          surface="soft"
          size="xs"
          :label="provider.status"
        />
      </VCluster>
    </VStack>
  </VCard>
</template>

<script setup lang="ts">
/**
 * ModelProviderCard
 * A business molecule representing a single ModelProvider entity.
 * Maps operational health states (HEALTHY, DEGRADED, OFFLINE) to design tokens.
 */
import { computed, ref } from 'vue';

import VCard from '@auraflux/design-system/components/molecules/resources/VCard.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VDivider from '@auraflux/design-system/components/atoms/layout/VDivider.vue';
import VChip from '@auraflux/design-system/components/molecules/indicators/VChip.vue';
import VSectionHeader from '@auraflux/design-system/components/molecules/indicators/VSectionHeader.vue';

import type {
  AttentionToken,
  BorderToken,
  GapSizeToken,
  IntentToken,
  RoundedToken,
  SpacingToken,
  SurfaceToken,
} from '@auraflux/design-system/interfaces/theme';
import type { ModelProvider } from '@auraflux/design-system/interfaces/agents';

export interface ModelProviderCardProps {
  padding?: SpacingToken;
  rounded?: RoundedToken;
  border?: BorderToken;
  attention?: AttentionToken;
  intent?: IntentToken;
  surface?: SurfaceToken;
  gap?: GapSizeToken;
  clickable?: boolean;
  hoverable?: boolean;
  /** The model provider data object */
  provider: ModelProvider;
}

const props = withDefaults(defineProps<ModelProviderCardProps>(), {
  padding: 'md',
  rounded: 'xl',
  clickable: true,
  hoverable: true,
});

const isExpanded = ref<boolean>(false);

/**
 * Maps operational health status to Design System intent tokens
 */
const statusConfig = computed(() => {
  switch (props.provider.status) {
    case 'ONLINE':
      return { cardIntent: 'neutral' as IntentToken, iconIntent: 'brand' as IntentToken, chipIntent: 'success' as IntentToken };
    case 'DEGRADED':
      return { cardIntent: 'warning' as IntentToken, iconIntent: 'warning' as IntentToken, chipIntent: 'warning' as IntentToken };
    case 'OFFLINE':
      return { cardIntent: 'danger' as IntentToken, iconIntent: 'danger' as IntentToken, chipIntent: 'danger' as IntentToken };
    default:
      return { cardIntent: 'neutral' as IntentToken, iconIntent: 'neutral' as IntentToken, chipIntent: 'neutral' as IntentToken };
  }
});
</script>