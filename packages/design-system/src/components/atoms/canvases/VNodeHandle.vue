<template>
  <Handle
    :id="props.id"
    :type="props.type"
    :position="props.position"
    :is-connectable="props.isConnectable"
    class="node-handle-atom"
    :class="[
      resolvedStyle.bg,
      resolvedStyle.text,
      resolvedStyle.border,
      surfaceClass,
      attentionClass,
      // Shared visual properties
      'w-3! h-3! border-2 rounded-full',
      'transition-transform duration-200 hover:scale-125',
      'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1'
    ]"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { Handle, type Position } from '@vue-flow/core';
import type { IntentToken, SurfaceToken, AttentionToken } from '@auraflux/design-system/interfaces/theme';
import { resolveSurfaceStyle } from '@auraflux/design-system/utils/theme';

/**
 * NodeHandle Atom
 * Standardized connection port for Vue Flow nodes.
 */

interface Props {
  id: string;
  type: 'source' | 'target';
  position: Position;
  intent?: IntentToken;
  surface?: SurfaceToken;
  attention?: AttentionToken;
  isConnectable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  intent: 'neutral',
  surface: 'base',
  attention: 'secondary',
  isConnectable: true,
});

const resolvedStyle = computed(() => resolveSurfaceStyle(props.attention, props.intent, props.surface));

const surfaceClass = computed(() => ({
  'shadow-sm': props.surface === 'base',
  'shadow-md': props.surface === 'solid'
}));

const attentionClass = computed(() => ({
  'ring-2 ring-indigo-400': props.attention === 'primary'
}));
</script>

<style scoped>
.node-handle-atom {
  z-index: 1;
}
</style>

