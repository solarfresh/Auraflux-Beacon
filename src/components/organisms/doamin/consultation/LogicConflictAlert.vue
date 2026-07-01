<template>
  <!-- 使用 VBox 作為基礎容器，管理邊距、邊框與背景 -->
  <VBox
    border="left"
    background="rose-50"
    padding="sm"
    rounded="md"
    class="border-rose-500 border-l-4 shadow-sm transition-all duration-300"
  >
    <VStack gap="sm">
      <VCluster align="center" gap="xs">
        <VIcon name="AlertTriangle" color="rose-500" size="sm" />
        <VTypography tag="span" size="xs" weight="bold" color="rose-900" class="uppercase tracking-wider">
          Logic Conflict Detected
        </VTypography>
      </VCluster>

      <VBox background="white" padding="sm" rounded="sm" border="all" class="border-rose-100">
        <VStack gap="xs">
          <VTypography tag="div" size="xs" weight="bold" color="rose-950" class="leading-snug">
            {{ conflictData.title }}
          </VTypography>
          <VTypography tag="div" size="xs" color="rose-800" class="leading-relaxed italic">
            "{{ conflictData.proposedAction }}" conflicts with
            <span class="font-semibold text-rose-900 underline">{{ conflictData.baselineReference }}</span>.
          </VTypography>
          <VTypography tag="div" size="xs" color="slate-600" class="leading-relaxed mt-1">
            {{ conflictData.impactAssessment }}
          </VTypography>
        </VStack>
      </VBox>

      <VCluster justify="end" gap="xs" class="flex-wrap pt-1">
        <VButton variant="ghost" size="xs" @click="$emit('dismiss')">
          Ignore
        </VButton>
        <VButton variant="danger" size="xs" @click="$emit('resolve')">
          Open Calibration
        </VButton>
      </VCluster>
    </VStack>
  </VBox>
</template>

<script setup lang="ts">
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';

interface ConflictSummary {
  title: string;
  proposedAction: string;
  baselineReference: string;
  impactAssessment: string;
}

defineProps<{
  conflictData: ConflictSummary;
}>();

defineEmits<{
  (e: 'dismiss'): void;
  (e: 'resolve'): void;
}>();
</script>