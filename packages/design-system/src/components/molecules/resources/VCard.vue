<template>
  <VBox
    :tag="tag"
    :padding="padding"
    rounded="md"
    border="all"
    :surface="surface"
    :clickable="clickable"
    class="w-full min-w-0 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all duration-200"
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
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import type { SizeToken, SpacingToken, SurfaceToken, TagToken } from '@auraflux/design-system/interfaces/theme';

export interface VCardProps {
  tag?: TagToken;
  padding?: SpacingToken;
  gap?: SizeToken;
  surface?: SurfaceToken;
  clickable?: boolean;
  hoverable?: boolean;
};

withDefaults(
  defineProps<VCardProps>(),
  {
    tag: 'div',
    padding: 'sm',
    gap: 'sm',
    surface: 'base',
    clickable: false,
    hoverable: true
  }
);
</script>