<template>
  <VBox
    padding="sm"
    rounded
    border="all"
    background="white"
    draggable="true"
    v-bind="$attrs"
    class="group cursor-grab shadow-sm hover:shadow-md transition-shadow active:cursor-grabbing"
    @dragstart="handleDragStart"
  >
    <VStack gap="sm">
      <VCluster justify="between" align="start" gap="sm">
        <VStack gap="none" class="flex-1 min-w-0">
          <VTypography
            tag="h4"
            size="sm"
            weight="bold"
            color="gray-900"
            truncate
            :title="resource.label"
          >
            {{ resource.label }}
          </VTypography>

          <VCluster gap="xs" class="mt-1">
            <VBadge :variant="sourceVariant" size="xs">{{ resource.sourceType }}</VBadge>
            <VBadge variant="gray" size="xs">{{ resource.format }}</VBadge>
          </VCluster>
        </VStack>

        <Button
          variant="ghost"
          size="xs"
          icon-only
          icon-name="PencilSquare"
          class="opacity-0 group-hover:opacity-100 transition-opacity"
          @click.stop="$emit('edit', resource)"
        />
      </VCluster>

      <VTypography tag="p" size="xs" color="gray-600" class="line-clamp-2 leading-relaxed">
        <VTypography tag="span" weight="bold" color="gray-900">Summary: </VTypography>
        {{ resource.summary || 'No distillation available.' }}
      </VTypography>

      <VCluster justify="between" align="center">
        <VCluster gap="xs">
          <VBadge
            v-for="keyword in resource.keywords.slice(0, 2)"
            :key="keyword"
            variant="gray"
            size="xs"
          >
            #{{ keyword }}
          </VBadge>
          <VTypography v-if="resource.keywords.length > 2" tag="span" size="xs" color="gray-400">
            +{{ resource.keywords.length - 2 }}
          </VTypography>
        </VCluster>

        <VBox v-if="resource.userNotes" padding="none" title="Has user notes">
          <VIcon name="DocumentVTypography" size="xs" color="amber-500" />
        </VBox>
      </VCluster>
    </VStack>
  </VBox>
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
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';

// Data Display Atoms
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBadge from '@/components/atoms/indicators/VBadge.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
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