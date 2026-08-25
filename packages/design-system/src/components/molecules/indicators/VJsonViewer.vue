<template>
  <VStack gap="xs" class="w-full">
    <!-- Header: Label & Schema Status Badge -->
    <VCluster justify="between" align="center" class="w-full">
      <VTypography
        tag="label"
        size="sm"
        weight="bold"
        attention="secondary"
        class="uppercase tracking-wider"
      >
        {{ label }}
      </VTypography>

      <VCluster gap="xs" align="center">
        <!-- Schema Validation Badge -->
        <VBadge
          v-if="isValidated"
          intent="success"
          size="xs"
          class="font-mono"
        >
          Schema Validated
        </VBadge>

        <!-- Copy Code Action -->
        <VButton
          type="button"
          size="xs"
          attention="secondary"
          @click="handleCopy"
        >
          {{ copied ? 'Copied!' : 'Copy' }}
        </VButton>
      </VCluster>
    </VCluster>

    <!-- JSON Code Block using VPre Atom -->
    <VPre
      size="xs"
      border="all"
      class="bg-gray-950 text-gray-100 border-gray-800 shadow-inner overflow-x-auto leading-relaxed"
    >
      <VCode
        padding="none"
        border="none"
        intent="neutral"
        surface="base"
        v-html="highlightedJson"
      />
    </VPre>
  </VStack>
</template>

<script setup lang="ts">
/**
 * VJsonViewer Component
 * Handles formatted JSON output rendering, syntax coloring, and Schema validation badges.
 * Built with VPre, VBadge, VButton, and Layout primitives.
 */
import { computed, ref } from 'vue';

import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VCode from '@auraflux/design-system/components/atoms/indicators/VCode.vue';
import VPre from '@auraflux/design-system/components/atoms/indicators/VPre.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';

export interface VJsonViewerProps {
  /** Section label text */
  label?: string;
  /** JSON data payload (object or pre-formatted JSON string) */
  value: Record<string, unknown> | string;
  /** Shows the 'Schema Validated' badge when true */
  isValidated?: boolean;
}

const props = withDefaults(defineProps<VJsonViewerProps>(), {
  label: 'Output Response',
  isValidated: true,
});

const copied = ref(false);

// Format and tokenize JSON string for syntax highlighting
const rawJsonString = computed(() => {
  if (typeof props.value === 'string') {
    try {
      return JSON.stringify(JSON.parse(props.value), null, 2);
    } catch {
      return props.value;
    }
  }
  return JSON.stringify(props.value, null, 2);
});

// Lightweight regex syntax highlighter for Keys and Values
const highlightedJson = computed(() => {
  if (!rawJsonString.value) return '';

  const escapedStr = rawJsonString.value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  return escapedStr.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = 'text-amber-300'; // Numbers
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'text-sky-400'; // JSON Keys
        } else {
          cls = 'text-emerald-300'; // String Values
        }
      } else if (/true|false/.test(match)) {
        cls = 'text-purple-400'; // Booleans
      } else if (/null/.test(match)) {
        cls = 'text-gray-500'; // Null
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
});

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(rawJsonString.value);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy JSON:', err);
  }
};
</script>