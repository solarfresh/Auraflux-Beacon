<template>
  <VBox
    tag="div"
    padding="none"
    border="none"
    background="transparent"
    class="relative inline-flex items-center justify-center min-w-3.5 min-h-3.5 group/tooltip"
  >

    <slot />

    <VTypography
      tag="div"
      size="xs"
      class="absolute hidden group-hover/tooltip:block z-50 w-56 p-2.5 bg-slate-900 text-white text-[11px] font-normal leading-relaxed rounded-md shadow-lg pointer-events-none opacity-95 whitespace-normal wrap-break-words transition-all duration-150"
      :class="positionClasses[position]"
    >
      <VTypography
        tag="span"
        class="absolute w-1.5 h-1.5 bg-slate-900 rotate-45"
        :class="arrowClasses[position]"
      />

      {{ content }}
    </VTypography>

  </VBox>
</template>

<script setup lang="ts">
/**
 * Tooltip Compound Molecule
 * Re-architected using VBox and VTypography tokens to ensure full Zero-HTML compliance.
 * Safeguards narrow screen viewports from dynamic AI description text overflow regressions.
 */
import VBox from '@/components/atoms/layout/VBox.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';

type TooltipPosition = 'top-center' | 'bottom-center' | 'bottom-right' | 'left-center';

withDefaults(
  defineProps<{
    /** The fallback context string passed down by AI modules (e.g., primaryInsight.description) */
    content: string;
    /** The dynamic alignment anchor location for the floating panel popup */
    position?: TooltipPosition;
  }>(),
  {
    position: 'bottom-right'
  }
);

/** Presets explicit style tokens ensuring pixel-perfect alignments across modular variations */
const positionClasses: Record<TooltipPosition, string> = {
  'top-center': 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  'bottom-center': 'top-full left-1/2 -translate-x-1/2 mt-2',
  'bottom-right': 'top-full right-0 mt-2 origin-top-right',
  'left-center': 'right-full top-1/2 -translate-y-1/2 mr-2'
};

/** Anchors the mini aesthetic indicator triangle dynamically based on layout tokens */
const arrowClasses: Record<TooltipPosition, string> = {
  'top-center': 'top-full left-1/2 -translate-x-1/2 -mt-0.5',
  'bottom-center': 'bottom-full left-1/2 -translate-x-1/2 -mb-0.5',
  'bottom-right': 'bottom-full right-3 -mb-0.5',
  'left-center': 'left-full top-1/2 -translate-y-1/2 -ml-0.5'
};
</script>