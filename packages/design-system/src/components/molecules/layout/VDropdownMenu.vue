<template>
  <VBox
    tag="div"
    :padding="padding"
    :rounded="rounded"
    :border="border"
    :attention="attention"
    :intent="intent"
    :surface="surface"
    :class="[
      // Positioning & Z-Index (Z-60 to sit above Floating Controls)
      'z-60',

      // Layout & Sizing
      'min-w-40 py-1 flex flex-col',

      // Flow Independence: Ensures it doesn't shift adjacent elements
      'pointer-events-auto'
    ]"
  >
    <slot />
  </VBox>
</template>

<script setup lang="ts">
/**
 * VDropdownMenu Molecule
 * * A structural orchestrator that manages the spatial zone for menu items.
 * Following the Layout Principles, it utilizes Level 3 Elevation (shadow-lg)
 * and maintains Flow Independence through absolute positioning.
 */
import type {
  SpacingToken,
  RoundedToken,
  BorderToken,
  AttentionToken,
  IntentToken,
  SurfaceToken
} from '@auraflux/design-system/interfaces/theme';

 import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';

export interface VDropdownMenuProps {
  /** Internal spacing token */
  padding?: SpacingToken;
  /** Radius token */
  rounded?: RoundedToken;
  /** Border position token */
  border?: BorderToken;
  /** Visual priority token */
  attention?: AttentionToken;
  /** Explicit semantic intent token */
  intent?: IntentToken;
  /** Explicit surface container model token */
  surface?: SurfaceToken;
};
const props = withDefaults(defineProps<VDropdownMenuProps>(), {
  padding: 'none',
  rounded: 'md',
  border: 'all',
});

 // Props can be expanded here for 'placement' logic (e.g., left, right, bottom)
</script>

<style scoped>
/**
 * Flow Independence:
 * The absolute positioning ensures it doesn't break the parent's document flow.
 * Transition logic can be added here or via Transition component for 'duration-300'.
 */
.v-dropdown-menu {
  /* Using standard system transitions for 'State-Driven Geometry' if needed */
  transform-origin: top right;
  transform: translateZ(0);
  backface-visibility: hidden;
}
</style>