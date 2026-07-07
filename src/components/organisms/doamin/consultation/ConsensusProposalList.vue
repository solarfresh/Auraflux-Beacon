<template>
  <VBox class="w-full">
    <VBox padding="none" class="mb-3 px-1">
      <VCluster justify="between" align="center">
        <VCluster gap="xs" align="center">
          <VTypography tag="span" size="xs" weight="bold" color="slate-500" class="uppercase tracking-wider">
            Proposals
          </VTypography>
          <VTypography
            tag="span"
            size="xs"
            weight="bold"
            color="slate-600"
            class="px-1.5 py-0.5 rounded-full bg-slate-100"
          >
            {{ proposals.length }}
          </VTypography>
        </VCluster>

        <VButton
          variant="ghost"
          size="xs"
          class="text-[10px] text-indigo-600 hover:text-indigo-700"
          @click="$emit('open-manager')"
        >
          View All
        </VButton>
      </VCluster>
    </VBox>

    <VStack gap="xs">
      <VBox
        v-for="p in proposals.slice(0, 3)"
        :key="p.id"
        padding="sm"
        rounded="md"
        border="left"
        background="white"
        class="border-l-4 shadow-sm transition-all"
        :class="stateStyles[p.status]"
      >
        <VStack gap="xs">
          <VCluster justify="between" align="start">
            <VTypography size="sm" weight="semibold" color="slate-900">{{ p.title }}</VTypography>
            <VTypography
              tag="span"
              size="xs"
              color="slate-500"
              class="px-1.5 py-0.5 rounded bg-slate-100 font-medium scale-90"
            >
              {{ p.dimension }}
            </VTypography>
          </VCluster>

          <VTypography size="xs" color="slate-600" class="leading-relaxed">
            {{ p.description }}
          </VTypography>

          <VCluster justify="end" gap="xs" class="pt-2">
            <VButton variant="ghost" size="xs" @click="$emit('edit-proposal', p.id)">Edit</VButton>
            <VButton
              v-if="p.status !== 'VALIDATED'"
              variant="secondary"
              size="xs"
              @click="$emit('approve', p.id)"
            >
              Approve
            </VButton>
          </VCluster>
        </VStack>
      </VBox>
    </VStack>
  </VBox>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';

const props = defineProps<{
  proposals: Array<{
    id: string;
    title: string;
    description: string;
    status: 'PROPOSED' | 'UNDER_REVIEW' | 'VALIDATED';
    dimension: string;
  }>;
}>();

const statusCounts = computed(() => ({
  PROPOSED: props.proposals.filter(p => p.status === 'PROPOSED').length,
  UNDER_REVIEW: props.proposals.filter(p => p.status === 'UNDER_REVIEW').length,
  VALIDATED: props.proposals.filter(p => p.status === 'VALIDATED').length
}));

const statusColors = {
  PROPOSED: 'bg-slate-300',
  UNDER_REVIEW: 'bg-indigo-500',
  VALIDATED: 'bg-emerald-500'
};

const stateStyles = {
  PROPOSED: 'border-slate-300',
  UNDER_REVIEW: 'border-indigo-500 bg-indigo-50/30',
  VALIDATED: 'border-emerald-500 bg-emerald-50/30'
};

defineEmits(['edit-proposal', 'approve', 'open-manager']);
</script>