<template>
  <li
    class="p-3 border border-gray-100 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-grab bg-white group flex flex-col gap-2"
    draggable="true"
    @dragstart="handleDragStart"
  >
    <div class="flex justify-between items-start gap-2">
      <div class="flex-1 min-w-0">
        <Text tag="h4" size="sm" weight="bold" color="gray-900" class="truncate" :title="resource.label">
          {{ resource.label }}
        </Text>
        <div class="flex flex-wrap gap-1.5 mt-1">
          <Badge :variant="sourceVariant" size="xs">{{ resource.sourceType }}</Badge>
          <Badge variant="gray" size="xs">{{ resource.format }}</Badge>
        </div>
      </div>

      <Button
        variant="ghost"
        size="xs"
        iconOnly
        iconName="PencilSquare"
        class="opacity-0 group-hover:opacity-100 transition-opacity"
        @click.stop="$emit('edit', resource)"
      />
    </div>

    <Text tag="p" size="xs" color="gray-600" class="line-clamp-2 leading-relaxed">
      <Text tag="span" weight="bold" color="gray-900">Summary:</Text>
      {{ resource.summary || 'No distillation available.' }}
    </Text>

    <div class="flex items-center justify-between mt-1">
      <div class="flex flex-wrap gap-1">
        <Badge
          v-for="keyword in resource.keywords.slice(0, 2)"
          :key="keyword"
          variant="gray"
          size="xs"
        >
          #{{ keyword }}
        </Badge>
        <Text v-if="resource.keywords.length > 2" tag="span" size="xs" color="gray-400">
          +{{ resource.keywords.length - 2 }}
        </Text>
      </div>

      <div v-if="resource.userNotes" class="flex items-center" title="Has user notes">
        <Icon name="DocumentText" size="xs" color="amber-500" />
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ResourceItem } from '@/interfaces/knowledge';
import Text from '@/components/atoms/Text.vue';
import Button from '@/components/atoms/Button.vue';
import Badge from '@/components/atoms/Badge.vue';
import Icon from '@/components/atoms/Icon.vue';

const props = defineProps<{
  resource: ResourceItem;
}>();

const emit = defineEmits<{
  (e: 'edit', resource: ResourceItem): void;
}>();

/**
 * Maps ResourceSource to specific Badge variants
 */
const sourceVariant = computed(() => {
  const mapping: Record<string, 'indigo' | 'emerald' | 'amber' | 'red' | 'purple' | 'gray'> = {
    ACADEMIC: 'indigo',
    NEWS: 'emerald',
    SOCIAL: 'amber',
    GOVERNMENT: 'purple',
    AI_GENERATED: 'red',
    MANUAL: 'gray'
  };
  return mapping[props.resource.sourceType] || 'gray';
});

function handleDragStart(event: DragEvent) {
  if (event.dataTransfer) {
    event.dataTransfer.setData('resource/json', JSON.stringify(props.resource));
    event.dataTransfer.effectAllowed = 'move';
  }
}
</script>