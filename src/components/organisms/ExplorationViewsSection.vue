<template>
  <section class="mb-6 pb-4 border-b border-gray-200">
    <div class="flex justify-between items-center mb-3 px-2">
      <Text tag="h3" size="sm" weight="semibold" color="gray-700">
        🗺️ Exploration Views
      </Text>

      <button
        @click="$emit('manage', 'create')"
        class="flex items-center px-2 py-1 rounded bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
        title="Create New Canvas View"
      >
        <Text tag="span" size="xs" weight="bold" color="white">
          + New View
        </Text>
      </button>
    </div>

    <ul class="space-y-1 max-h-48 overflow-y-auto px-1 scrollbar-none">
      <ViewListItem
        v-for="view in views"
        :key="view.id"
        :name="view.name"
        :is-active="view.id === activeId"
        @select="$emit('switch', view.id)"
      />
    </ul>
  </section>
</template>

<script setup lang="ts">
import type { CanvasView } from '@/interfaces/exploration';
import Text from '@/components/atoms/Text.vue';
import ViewListItem from '@/components/molecules/list-items/ViewListItem.vue';

defineProps<{
  views: CanvasView[];
  activeId: string;
}>();

defineEmits<{
  /** Switch to a specific canvas view */
  (e: 'switch', viewId: string): void;
  /** Trigger management actions (create/rename/delete) */
  (e: 'manage', action: 'create' | 'rename' | 'delete', viewId?: string): void;
}>();
</script>
