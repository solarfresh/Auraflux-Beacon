<template>
  <VBox
    :background="isActive ? 'white' : 'transparent'"
    :border="isActive ? 'all' : 'none'"
    padding="md"
    rounded="xl"
    class="transition-all duration-300 group"
    :class="!isActive && !isCompleted ? 'opacity-50' : 'opacity-100'"
  >
    <VStack gap="sm" align="center">
      <VBox
        :background="isActive ? 'indigo-50' : 'slate-50'"
        padding="sm"
        rounded="full"
      >
        <VIcon
          :name="icon"
          :type="isActive ? 'solid' : 'outline'"
          :color="isActive ? 'indigo-600' : 'slate-400'"
          size="lg"
        />
      </VBox>

      <VStack gap="none" align="center" class="text-center">
        <VTypography
          tag="strong"
          size="base"
          :weight="isActive ? 'bold' : 'medium'"
          :color="isActive ? 'slate-900' : 'slate-500'"
        >
          {{ label }}
        </VTypography>

        <VTypography
          tag="span"
          size="xs"
          color="slate-400"
          class="italic"
        >
          {{ subLabel }}
        </VTypography>
      </VStack>
    </VStack>
  </VBox>
</template>

<script setup lang="ts">
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VTypography from '@/components/atoms/VTypography.vue';
import VIcon from '@/components/atoms/VIcon.vue';

defineProps<{
  label: string;       // e.g., "Define"
  subLabel: string;    // e.g., "Clarify Anxiety"
  icon: string;        // e.g., "magnifying-glass"
  isActive?: boolean;
  isCompleted?: boolean;
}>();
</script>