<template>
  <VAlert
    :variant="config.variant"
    :class="['border-l-4', config.borderColor]"
  >
    <template #header>
      <VIcon :name="config.icon" :color="config.iconColor" size="sm" />
      <VTypography tag="span" size="xs" weight="bold" :color="config.textColor" class="uppercase tracking-wider">
        {{ config.headerText }}
      </VTypography>
    </template>

    <VBox background="white" padding="sm" rounded="sm" border="all" class="border-rose-100/50">
      <VStack gap="xs">
        <VTypography size="xs" weight="bold" color="slate-900">{{ title }}</VTypography>

        <VTypography v-if="type === 'CONFLICT'" size="xs" color="rose-800" class="leading-relaxed italic">
          "{{ conflictData?.proposedAction }}" conflicts with
          <VTypography tag="span" size="xs" weight="semibold" color="rose-900" class="underline">
            {{ conflictData?.baselineReference }}
          </VTypography>.
        </VTypography>

        <VTypography v-if="type === 'GAP'" size="xs" color="slate-600" class="leading-relaxed">
          {{ description }}
        </VTypography>

        <VTypography
          v-if="type === 'GAP' && consensus"
          size="xs"
          weight="medium"
          color="indigo-600"
          class="italic pt-0.5"
        >
          Consensus: {{ consensus }}
        </VTypography>
      </VStack>
    </VBox>

    <template #actions>
      <VButton variant="ghost" size="xs" @click="$emit('dismiss')">Ignore</VButton>
      <VButton :variant="config.buttonVariant" size="xs" @click="$emit('resolve')">
        Open Calibration
      </VButton>
    </template>
  </VAlert>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VAlert from '@/components/molecules/feedback/VAlert.vue';

const props = defineProps<{
  type: 'CONFLICT' | 'GAP';
  title: string;
  description?: string;
  consensus?: string;
  conflictData?: { proposedAction: string; baselineReference: string; impactAssessment: string; };
}>();

const config = computed(() => {
  if (props.type === 'CONFLICT') {
    return {
      variant: 'danger',
      borderColor: 'border-l-rose-500',
      icon: 'AlertTriangle',
      iconColor: 'rose-500',
      textColor: 'rose-900',
      headerText: 'Logic Conflict Detected',
      buttonVariant: 'danger'
    };
  }

  return {
    variant: 'warning',
    borderColor: 'border-l-amber-500',
    icon: 'AlertTriangle',
    iconColor: 'amber-600',
    textColor: 'amber-900',
    headerText: 'Consultation Gap',
    buttonVariant: 'secondary'
  };
});
</script>