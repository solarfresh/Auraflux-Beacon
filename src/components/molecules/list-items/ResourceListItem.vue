<template>
  <Box
    padding="sm"
    rounded
    border="all"
    background="white"
    draggable="true"
    v-bind="$attrs"
    class="group cursor-grab shadow-sm hover:shadow-md transition-shadow active:cursor-grabbing"
    @dragstart="handleDragStart"
  >
    <Stack gap="sm">
      <Cluster justify="between" align="start" gap="sm">
        <Stack gap="none" class="flex-1 min-w-0">
          <Text
            tag="h4"
            size="sm"
            weight="bold"
            color="gray-900"
            truncate
            :title="resource.label"
          >
            {{ resource.label }}
          </Text>

          <Cluster gap="xs" class="mt-1">
            <Badge :variant="sourceVariant" size="xs">{{ resource.sourceType }}</Badge>
            <Badge variant="gray" size="xs">{{ resource.format }}</Badge>
          </Cluster>
        </Stack>

        <Button
          variant="ghost"
          size="xs"
          icon-only
          icon-name="PencilSquare"
          class="opacity-0 group-hover:opacity-100 transition-opacity"
          @click.stop="$emit('edit', resource)"
        />
      </Cluster>

      <Text tag="p" size="xs" color="gray-600" class="line-clamp-2 leading-relaxed">
        <Text tag="span" weight="bold" color="gray-900">Summary: </Text>
        {{ resource.summary || 'No distillation available.' }}
      </Text>

      <Cluster justify="between" align="center">
        <Cluster gap="xs">
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
        </Cluster>

        <Box v-if="resource.userNotes" padding="none" title="Has user notes">
          <Icon name="DocumentText" size="xs" color="amber-500" />
        </Box>
      </Cluster>
    </Stack>
  </Box>
</template>

<script setup lang="ts">
/**
 * ResourceListItem (Molecule)
 * Represents research materials with deep metadata.
 * Refactored to eliminate 'li' and 'div' in favor of Layout Atoms.
 */
import { computed } from 'vue';
import type { ResourceItem } from '@/interfaces/knowledge';

// Layout Atoms
import Box from '@/components/atoms/layout/Box.vue';
import Stack from '@/components/atoms/layout/Stack.vue';
import Cluster from '@/components/atoms/layout/Cluster.vue';

// Data Display Atoms
import Text from '@/components/atoms/data-display/Text.vue';
import Badge from '@/components/atoms/data-display/Badge.vue';
import Icon from '@/components/atoms/data-display/Icon.vue';
import Button from '@/components/atoms/actions/Button.vue';

const props = defineProps<{
  resource: ResourceItem;
}>();

const emit = defineEmits<{
  (e: 'edit', resource: ResourceItem): void;
}>();

// Ensure $attrs doesn't bleed into the root Box if not intended,
// but here we use it to support dynamic parent-driven classes.
defineOptions({
  inheritAttrs: false
});

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
    // Industrial Standard: Using specific MIME type for internal resource transfer
    event.dataTransfer.setData('resource/json', JSON.stringify(props.resource));
    event.dataTransfer.effectAllowed = 'move';
  }
}
</script>