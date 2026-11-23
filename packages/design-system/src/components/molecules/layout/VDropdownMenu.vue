<template>
  <Teleport to="body">
    <VBox
      v-if="modelValue"
      tag="div"
      class="fixed inset-0 z-50"
      surface="ghost"
      @click="emit('update:modelValue', false)"
    />
    <VBox
      v-if="modelValue"
      tag="div"
      :padding="padding"
      :rounded="rounded"
      :border="border"
      :attention="attention"
      :intent="intent"
      :surface="surface"
      :style="{ width }"
      :class="[
        // Positioning & Z-Index
        'z-60 fixed',

        // Layout & Sizing
        'min-w-40 py-1 flex flex-col',

        // Flow Independence
        'pointer-events-auto'
      ]"
    >
      <slot />
    </VBox>
  </Teleport>
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
  SurfaceToken,
  PositionToken
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
  /** Positioning relative to trigger */
  position?: PositionToken;
  /** Menu visibility state */
  modelValue: boolean;
  /** Container width */
  width?: string;
};

export interface VDropdownMenuEmits {
  (e: 'update:modelValue', value: boolean): void;
  (e: 'select', value: string | number): void;
};
const props = withDefaults(defineProps<VDropdownMenuProps>(), {
  padding: 'none',
  rounded: 'md',
  border: 'all',
  position: 'bottom-start',
  width: 'auto',
});
const emit = defineEmits<VDropdownMenuEmits>();

// Provide select event
const handleSelect = (value: string | number) => {
  emit('select', value);
  emit('update:modelValue', false);
};

defineExpose({
  handleSelect
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