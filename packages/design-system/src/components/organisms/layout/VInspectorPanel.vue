<template>
  <VBox class="relative flex h-full" tag="div">
    <!-- Edge Tab Button: Positioned on the outer boundary of the panel for collapse/expand control using VButton with iconName -->
    <VButton
      class="absolute -left-6 top-1/2 -translate-y-1/2 z-20"
      size="sm"
      :icon-name="isExpanded ? 'ChevronRight' : 'ChevronLeft'"
      :icon-only="true"
      rounded="none"
      border="none"
      :title="isExpanded ? 'Collapse Panel' : 'Expand Panel'"
      @click="toggle"
    />

    <!-- Main Panel Container: Supports smooth collapse/expand via dynamic width -->
    <VBox
      class="h-full transition-all duration-200 overflow-hidden flex flex-col"
      :class="isExpanded ? 'w-80' : 'w-0'"
      :intent="intent"
      :surface="surface"
      :border="border"
    >
      <VBox v-if="isExpanded" class="flex-1 overflow-y-auto p-4 flex flex-col">
        <slot />
      </VBox>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import type { IntentToken, SurfaceToken, BorderToken } from '@auraflux/design-system/interfaces/theme';

const props = withDefaults(defineProps<{
  isExpanded?: boolean;
  intent?: IntentToken;
  surface?: SurfaceToken;
  border?: BorderToken;
}>(), {
  isExpanded: true,
  intent: 'neutral',
  surface: 'soft',
  border: 'left'
});

const emit = defineEmits<{
  (e: 'update:isExpanded', value: boolean): void;
  (e: 'toggle'): void;
}>();

const toggle = () => {
  emit('update:isExpanded', !props.isExpanded);
  emit('toggle');
};
</script>
