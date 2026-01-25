<template>
  <Box
    padding="sm"
    rounded
    border="all"
    clickable
    :background="isActive ? 'indigo-50' : 'white'"
    :class="[
      'transition-all duration-200',
      isActive ? 'border-indigo-200 shadow-sm' : 'border-gray-100 hover:border-gray-300'
    ]"
    @click="$emit('click')"
  >
    <Stack gap="xs">
      <Cluster justify="between" align="center">
        <VTypography
          tag="span"
          size="xs"
          weight="bold"
          :color="isActive ? 'indigo-600' : 'gray-400'"
        >
          {{ formattedDate }}
        </VTypography>
        <VBadge v-if="entry.status === 'draft'" variant="amber" size="xs">Draft</VBadge>
      </Cluster>

      <VTypography
        tag="p"
        size="sm"
        weight="semibold"
        :color="isActive ? 'indigo-900' : 'gray-900'"
        truncate
      >
        {{ entry.title || "Untitled Reflection" }}
      </VTypography>

      <VTypography
        tag="p"
        size="xs"
        color="gray-500"
        class="truncate italic"
      >
        {{ entry.content || "No content provided." }}
      </VTypography>
    </Stack>
  </Box>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ReflectionLogEntry } from '@/interfaces/workflow';
import Box from '@/components/atoms/layout/Box.vue';
import Stack from '@/components/atoms/layout/Stack.vue';
import Cluster from '@/components/atoms/layout/Cluster.vue';
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