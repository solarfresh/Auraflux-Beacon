<template>
  <VStack
    full-height
    align="center"
    justify="center"
    gap="lg"
    class="opacity-90 transition-opacity duration-300"
  >
    <VBox
      :padding="padding"
      :rounded="rounded"
      :border="border"
      :attention="attention"
      :intent="intent"
      :surface="surface"
      class="shadow-sm"
    >
      <VIcon
        :name="icon"
        :size="iconSize"
      />
    </VBox>

    <VStack gap="xs" align="center" class="max-w-xs text-center">
      <VTypography
        tag="h3"
        :size="titleSize"
        weight="semibold"
      >
        {{ title }}
      </VTypography>

      <VTypography
        :size="descriptionSize"
        class="leading-relaxed"
      >
        <slot>{{ description }}</slot>
      </VTypography>
    </VStack>

    <slot name="actions" />
  </VStack>
</template>

<script setup lang="ts">
/**
 * VEmptyState Component
 * A reusable layout for empty panel states, lists, or search results.
 */
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import type { AttentionToken, BorderToken, ComponentSizeToken, IntentToken, RoundedToken, SpacingToken, SurfaceToken } from '@auraflux/design-system/interfaces/theme';

interface VEmptyStateProps {
  /** Heroicon name to display */
  icon?: string;
  /** Primary headline */
  title: string;
  /** Secondary guidance text */
  description?: string;
  /** Size token for the hero icon */
  iconSize?: ComponentSizeToken;
  /** Size token for the title typography */
  titleSize?: ComponentSizeToken;
  /** Size token for the description typography */
  descriptionSize?: ComponentSizeToken;
  border?: BorderToken;
  rounded?: RoundedToken;
  padding?: SpacingToken;
  attention?: AttentionToken;
  /** Semantic color intent (e.g., 'neutral', 'brand', 'danger', 'warning') */
  intent?: IntentToken;
  surface?: SurfaceToken;
}

withDefaults(defineProps<VEmptyStateProps>(), {
  icon: 'Inbox',
  iconSize: 'lg',
  titleSize: 'lg',
  descriptionSize: 'sm',
  padding: 'lg',
  rounded: '2xl',
  border: 'all',
  attention: undefined,
  intent: undefined,
  surface: undefined,
});
</script>