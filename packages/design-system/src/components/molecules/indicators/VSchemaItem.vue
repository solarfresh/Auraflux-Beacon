<template>
  <VBox
    padding="sm"
    rounded="md"
    border="all"
    surface="base"
    intent="neutral"
    class="w-full transition-colors hover:border-gray-300"
  >
    <VCluster justify="between" align="center" gap="sm">
      <VCluster align="center" gap="xs">
        <VTypography
          tag="span"
          size="xs"
          weight="bold"
          class="font-mono"
        >
          {{ name }}
        </VTypography>

        <VTypography
          v-if="type"
          tag="span"
          size="xs"
          attention="secondary"
          class="font-mono text-gray-400"
        >
          {{ type }}
        </VTypography>
      </VCluster>

      <slot name="badge">
        <VBadge
          v-if="badgeText"
          :intent="badgeIntent"
          size="xs"
          class="font-sans text-[10px]"
        >
          {{ badgeText }}
        </VBadge>
      </slot>
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import type { IntentToken } from '@auraflux/design-system/interfaces/theme';

export interface VSchemaItemProps {
  name: string;
  type?: string;
  badgeText?: string;
  badgeIntent?: IntentToken;
}

withDefaults(defineProps<VSchemaItemProps>(), {
  type: '',
  badgeText: '',
  badgeIntent: 'neutral',
});
</script>