<template>
  <VTypography v-if="$slots.trigger" ref="triggerRef" tag="span" @click="emit('update:modelValue', !modelValue)">
    <slot name="trigger" />
  </VTypography>
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
      ref="menuRef"
      tag="div"
      :padding="padding"
      :rounded="rounded"
      :border="border"
      :attention="attention"
      :intent="intent"
      :surface="surface"
      :style="{ width, top: `${menuPos.top}px`, left: `${menuPos.left}px` }"
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
import { ref, watch, nextTick } from 'vue';
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
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';

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
  intent: 'neutral',
  surface: 'solid',
  position: 'bottom-start',
  width: 'auto',
});
const emit = defineEmits<VDropdownMenuEmits>();

const triggerRef = ref<any>(null);
const menuRef = ref<any>(null);
const menuPos = ref({ top: 0, left: 0 });

const GAP = 4;
const VIEWPORT_PADDING = 8;

watch(
  () => props.modelValue,
  async (open) => {
    if (!open) return;
    await updatePosition();
  }
);

// Provide select event
const handleSelect = (value: string | number) => {
  emit('select', value);
  emit('update:modelValue', false);
};

const updatePosition = async () => {
  await nextTick();
  await new Promise<void>((resolve) => requestAnimationFrame(() => resolve()));

  const rawTrigger: any = triggerRef.value?.$el ?? triggerRef.value;
  const triggerEl: HTMLElement | undefined =
    rawTrigger?.firstElementChild instanceof HTMLElement
      ? rawTrigger.firstElementChild
      : rawTrigger;

  const rawMenu: any = menuRef.value?.$el ?? menuRef.value;
  const menuEl: HTMLElement | undefined =
    rawMenu instanceof HTMLElement ? rawMenu : rawMenu?.firstElementChild;

  if (!triggerEl?.getBoundingClientRect) return;

  const tRect = triggerEl.getBoundingClientRect();
  if (tRect.width === 0 && tRect.height === 0) return;

  const mRect = menuEl?.getBoundingClientRect();
  const menuWidth = mRect?.width || 160;
  const menuHeight = mRect?.height || 160;

  let left = tRect.right - menuWidth;
  if (left < VIEWPORT_PADDING) {
    left = Math.min(tRect.left, window.innerWidth - VIEWPORT_PADDING - menuWidth);
  }
  left = Math.max(VIEWPORT_PADDING, left);

  let top = tRect.bottom + GAP;
  if (top + menuHeight > window.innerHeight - VIEWPORT_PADDING) {
    top = tRect.top - menuHeight - GAP;
  }
  top = Math.max(VIEWPORT_PADDING, Math.min(top, window.innerHeight - VIEWPORT_PADDING - menuHeight));

  menuPos.value = {
    top: Math.round(top),
    left: Math.round(left),
  };
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