<template>
  <VBox
    tag="div"
    padding="none"
    border="none"
    background="transparent"
    class="relative inline-flex items-center justify-center group/tooltip"
  >
    <slot />

    <VBox
      tag="div"
      padding="none"
      border="none"
      :intent="intent"
      :surface="surface"
      class="absolute hidden group-hover/tooltip:flex z-[9999] w-56 p-2.5 rounded-md shadow-lg pointer-events-none opacity-95 transition-all duration-150"
      :class="positionClasses[position]"
    >
      <VTypography
        tag="span"
        :intent="intent"
        :surface="surface"
        class="absolute w-1.5 h-1.5 rotate-45"
        :class="arrowClasses[position]"
      />

      <VTypography
        tag="span"
        size="xs"
        :intent="intent"
        :surface="surface"
        weight="normal"
        class="text-[11px] leading-relaxed whitespace-normal break-words"
      >
        {{ content }}
      </VTypography>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import type { IntentToken, SurfaceToken } from '@auraflux/design-system/interfaces/theme';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';

type TooltipPosition = 'top-center' | 'bottom-center' | 'bottom-right' | 'left-center';

export interface VTooltipProps {
  /** The content string displayed inside the tooltip */
  content: string;
  /** Dynamic alignment position for the tooltip popup */
  position?: TooltipPosition;
  /** Semantic intent color token */
  intent?: IntentToken;
  /** Surface color/contrast token */
  surface?: SurfaceToken;
}

withDefaults(defineProps<VTooltipProps>(), {
  position: 'bottom-right',
  intent: 'neutral',
  surface: 'solid',
});

const positionClasses: Record<TooltipPosition, string> = {
  'top-center': 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  'bottom-center': 'top-full left-1/2 -translate-x-1/2 mt-2',
  'bottom-right': 'top-full right-0 mt-2 origin-top-right',
  'left-center': 'right-full top-1/2 -translate-y-1/2 mr-2',
};

const arrowClasses: Record<TooltipPosition, string> = {
  'top-center': 'top-full left-1/2 -translate-x-1/2 -mt-0.5',
  'bottom-center': 'bottom-full left-1/2 -translate-x-1/2 -mb-0.5',
  'bottom-right': 'bottom-full right-3 -mb-0.5',
  'left-center': 'left-full top-1/2 -translate-y-1/2 -ml-0.5',
};
</script>