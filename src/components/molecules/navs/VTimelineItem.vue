<template>
  <VBox
    padding="sm"
    rounded
    border="all"
    clickable
    :background="isActive ? 'indigo-50' : 'white'"
    :class="[
      'transition-all duration-200',
      isActive ? 'border-indigo-200 shadow-sm' : 'border-slate-100 hover:border-slate-300'
    ]"
    @click="$emit('click')"
  >
    <VStack gap="xs">
      <VCluster justify="between" align="center">
        <VTypography
          tag="span"
          size="xs"
          weight="bold"
          :color="isActive ? 'indigo-600' : 'slate-400'"
        >
          {{ formattedDate }}
        </VTypography>
        <VBadge v-if="entry.status === 'draft'" variant="amber" size="xs">Draft</VBadge>
      </VCluster>

      <VTypography
        tag="p"
        size="sm"
        weight="semibold"
        :color="isActive ? 'indigo-900' : 'slate-900'"
        truncate
      >
        {{ entry.title || "Untitled Reflection" }}
      </VTypography>

      <VTypography
        tag="p"
        size="xs"
        color="slate-500"
        class="truncate italic"
      >
        {{ entry.content || "No content provided." }}
      </VTypography>
    </VStack>
  </VBox>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ReflectionLogEntry } from '@/interfaces/workflow';
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBadge from '@/components/atoms/indicators/VBadge.vue';

const props = defineProps<{
  entry: ReflectionLogEntry;
  isActive?: boolean;
}>();

defineEmits(['click']);

const formattedDate = computed(() => {
  const date = new Date(props.entry.updatedAt);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});
</script>