<template>
  <VBox
    tag="div"
    padding="none"
    v-bind="$attrs"
    :class="[
      'absolute top-1/2 -translate-y-1/2 z-40 transition-all duration-300 ease-in-out',
      side === 'right' ? 'right-0' : 'left-0'
    ]"
    :style="dynamicPosition"
  >
    <VButton
      variant="secondary"
      size="sm"
      :icon-only="true"
      :iconName="iconName"
      :class="[
        'h-10 w-6 flex items-center justify-center shadow-lg bg-white border border-slate-200 hover:bg-slate-50',
        side === 'right' ? 'rounded-r-none border-r-0' : 'rounded-l-none border-l-0'
      ]"
      @click="emit('toggle')"
    />
  </VBox>
</template>

<script setup lang="ts">
/**
 * VFloatControl (Molecule)
 * A specialized floating trigger used for collapsing sidebars or panels.
 * Integrates with the system's absolute positioning and transition rhythm.
 */
import { computed } from 'vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';

defineOptions({ inheritAttrs: false });

interface Props {
  side: 'left' | 'right';
  isOpen: boolean;
  /** The offset distance when the panel is open (e.g., '384px') */
  offset?: string;
}

const props = withDefaults(defineProps<Props>(), {
  offset: '0px'
});

const emit = defineEmits<{
  (e: 'toggle'): void;
}>();

/** Calculates the dynamic translation based on panel state */
const dynamicPosition = computed(() => {
  if (!props.isOpen) return { [props.side]: '0px' };
  return { [props.side]: props.offset };
});

const iconName = computed(() => {
  if (props.side === 'right') {
    return props.isOpen ? 'ChevronRight' : 'ChevronLeft';
  }
  return props.isOpen ? 'ChevronLeft' : 'ChevronRight';
});
</script>