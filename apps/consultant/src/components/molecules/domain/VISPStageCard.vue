<template>
  <VBox
    :background="'white'"
    :border="'all'"
    :padding="size === 'lg' ? 'lg' : 'md'"
    rounded="xl"
    :class="[
      'transition-all duration-300 group w-full',
      'shadow-lg hover:translate-x-2',
    ]"
  >
    <VCluster gap="md" align="center">
      <VBox
        :background="'white'"
        :padding="size === 'lg' ? 'md' : 'sm'"
        rounded="lg"
        class="shadow-sm transition-colors duration-300"
      >
        <VIcon
          :name="icon"
          :type="'solid'"
          :size="size === 'lg' ? 'xl' : 'lg'"
        />
      </VBox>

      <VStack gap="none" align="start">
        <VTypography
          tag="strong"
          :size="size === 'lg' ? 'lg' : 'md'"
          :weight="'bold'"
          :color="'slate-900'"
          class="tracking-tight uppercase"
        >
          {{ label }}
        </VTypography>

        <VTypography
          tag="p"
          :size="'sm'"
          :weight="'normal'"
          color="slate-400"
          class="leading-relaxed max-w-prose"
        >
          {{ description }}
        </VTypography>
      </VStack>
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';

withDefaults(defineProps<{
  label: string;
  description: string;
  icon: string;
  size?: 'md' | 'lg'; // Added for Landing Page scaling
}>(), {
  size: 'md'
});
</script>
