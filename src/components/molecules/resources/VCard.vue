<template>
  <VBox
    :tag="tag"
    :padding="padding"
    :rounded="true"
    border="none"
    :background="background"
    :hover-background="hoverBackground"
    :clickable="clickable"
    class="w-full min-w-0 border border-slate-200/80 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-200"
    :class="{
      'hover:shadow-[0_3px_6px_rgba(0,0,0,0.04)] hover:translate-y-[-0.5px]': hoverable && clickable
    }"
  >
    <VStack
      :gap="gap"
      align="stretch"
      justify="start"
      class="w-full"
    >
      <slot />
    </VStack>
  </VBox>
</template>

<script setup lang="ts">
/**
 * Card Layout Molecule
 * Marries VBox (Skin layer) and VStack (Flow layer).
 * Aligned with atomic tokens to prevent visual regression in sidebars.
 */
import type { SpacingToken, BackgroundToken, GapSize } from '@/interfaces/layout';
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';

withDefaults(
  defineProps<{
    tag?: string;
    padding?: SpacingToken;
    gap?: GapSize;
    background?: BackgroundToken;
    hoverBackground?: BackgroundToken;
    clickable?: boolean;
    hoverable?: boolean;
  }>(),
  {
    tag: 'div',
    padding: 'sm',        // Matches p-3 (12px) spacing in VBox token map
    gap: 'sm',            // Matches gap-sm vertical grid spacing
    background: 'white',  // Binds onto 'bg-white' token map
    clickable: false,
    hoverable: true
  }
);
</script>