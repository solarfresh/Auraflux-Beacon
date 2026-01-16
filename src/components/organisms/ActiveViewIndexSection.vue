<template>
  <section class="flex-1 flex flex-col min-h-0">
    <div class="mb-4 px-2">
      <Text tag="h3" size="sm" weight="semibold" color="gray-700">
        🔍 Active View Index
      </Text>
    </div>

    <div class="space-y-4 px-2 overflow-y-auto scrollbar-none">
      <IndexStatItem
        label="Insight Nodes"
        :count="summary.insight"
        color="purple-700"
        @navigate="$emit('navigate', 'insight-root')"
      />

      <IndexStatItem
        label="Query Nodes"
        :count="summary.query"
        color="red-700"
        @navigate="$emit('navigate', 'query-root')"
      />

      <IndexStatItem
        label="Group Nodes"
        :count="summary.group"
        color="green-700"
        @navigate="$emit('navigate', 'group-root')"
      />
    </div>
  </section>
</template>

<script setup lang="ts">
import type { NodeSummary } from '@/interfaces/exploration';
import Text from '@/components/atoms/Text.vue';
import IndexStatItem from '@/components/molecules/IndexStatItem.vue';

defineProps<{
  summary: NodeSummary;
}>();

defineEmits<{
  /** Emitted to focus/pan the canvas to a specific category or node */
  (e: 'navigate', categoryId: string): void;
}>();
</script>
