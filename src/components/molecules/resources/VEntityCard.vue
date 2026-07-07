<template>
  <VCard
    :padding="padding"
    :clickable="clickable || isActive"
    :background="isActive ? 'indigo-50' : 'white'"
    class="border-l-4 group relative transition-all duration-200"
    :class="[
      safeStatusStyle,
      isActive ? 'border-indigo-200 shadow-sm' : 'border-transparent hover:bg-slate-50',
      { 'opacity-60 bg-slate-50/50': node.status === 'ON_HOLD' }
    ]"
  >
    <VCluster align="start" gap="md" full-width class="min-w-0">

      <VBox padding="none" class="relative mt-1 shrink-0">
        <div
          :class="[
            'w-3 h-3 rounded-full transition-all duration-500',
            solidityStyles.colorClass,
            solidityStyles.shadowClass
          ]"
        />
        <VBox
          padding="none"
          background="white"
          class="absolute -top-1.5 -right-1.5 p-0.5 shadow-sm scale-75 rounded-full border border-slate-200"
        >
          <VIcon :name="typeIcon" :color="typeColor" size="xs" />
        </VBox>
      </VBox>

      <VStack gap="none" class="flex-1 min-w-0">
        <VTypography
          tag="span"
          size="xs"
          weight="bold"
          :color="isActive ? 'indigo-600' : 'slate-400'"
          class="uppercase tracking-tighter"
        >
          {{ node.type }}
        </VTypography>

        <VTooltip
          v-if="node.content"
          :content="node.content"
          position="bottom-center"
          class="w-full justify-start"
        >
          <VTypography
            tag="h4"
            :size="isActive ? 'base' : 'sm'"
            :weight="isActive ? 'bold' : 'semibold'"
            :color="isActive ? 'slate-900' : 'slate-700'"
            class="truncate leading-tight text-left w-full cursor-help"
          >
            {{ node.label }}
          </VTypography>
        </VTooltip>

        <VTypography
          v-else
          tag="h4"
          :size="isActive ? 'base' : 'sm'"
          :weight="isActive ? 'bold' : 'semibold'"
          :color="isActive ? 'slate-900' : 'slate-700'"
          class="truncate leading-tight"
        >
          {{ node.label }}
        </VTypography>

        <VTypography
          v-if="node.content && showContent"
          size="xs"
          color="slate-600"
          class="leading-relaxed mt-1 line-clamp-2"
        >
          {{ node.content }}
        </VTypography>
      </VStack>

      <VBox
        padding="none"
        class="self-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1 shrink-0"
      >
        <slot name="actions" />
      </VBox>

    </VCluster>
  </VCard>
</template>

<script setup lang="ts">
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VTooltip from '@/components/molecules/feedback/VTooltip.vue';
import VCard from '@/components/molecules/resources/VCard.vue';
import type { ConceptualNode } from '@/interfaces/conceptual-map';
import type { SpacingToken } from '@/interfaces/layout';
import { computed } from 'vue';

const props = withDefaults(
  defineProps<{
    node: ConceptualNode;
    padding?: SpacingToken;
    showContent?: boolean;
    clickable?: boolean;
    isActive?: boolean;
  }>(),
  {
    padding: 'sm',
    showContent: true,
    clickable: false,
    isActive: false
  }
);

const statusStyles = {
  USER_DRAFT: 'border-l-slate-300',
  AI_EXTRACTED: 'border-l-indigo-500 bg-indigo-50/10',
  LOCKED: 'border-l-emerald-500 bg-emerald-50/10',
  ON_HOLD: 'border-l-amber-400',
  ARCHIVED: 'border-l-slate-400 opacity-40'
};

const safeStatusStyle = computed(() => {
  const currentStatus = props.node.status || 'USER_DRAFT';
  return statusStyles[currentStatus] || statusStyles.USER_DRAFT;
});

const solidityStyles = computed(() => {
  const currentStatus = props.node.status || 'USER_DRAFT';
  if (currentStatus === 'LOCKED') {
    return { colorClass: 'bg-emerald-500', shadowClass: 'shadow-[0_0_8px_rgba(16,185,129,0.4)]' };
  }
  if (currentStatus === 'AI_EXTRACTED') {
    return { colorClass: 'bg-amber-400', shadowClass: 'shadow-[0_0_8px_rgba(251,191,36,0.3)]' };
  }
  return { colorClass: 'bg-slate-300', shadowClass: '' };
});

const typeIcon = computed(() => {
  const normalizedType = props.node.type?.toLowerCase();
  const iconMap: Record<string, string> = {
    event: 'Calendar', outcome: 'Flag', boundary: 'ShieldExclamation', entity: 'Cube',
    focus: 'MapPin', resource: 'DocumentDuplicate', concept: 'Square3Stack3D',
    insight: 'LightBulb', query: 'MagnifyingGlassCircle', navigation: 'RocketLaunch',
    group: 'RectangleGroup', risk: 'ExclamationTriangle'
  };
  return iconMap[normalizedType] || 'CircleStack';
});

const typeColor = computed(() => {
  if (props.isActive) return 'indigo-600';
  const normalizedType = props.node.type?.toLowerCase();
  const colorMap: Record<string, string> = {
    focus: 'indigo-600', resource: 'blue-500', insight: 'emerald-500',
    query: 'amber-500', group: 'purple-500', navigation: 'rose-500', risk: 'red-500'
  };
  return colorMap[normalizedType] || 'slate-500';
});
</script>