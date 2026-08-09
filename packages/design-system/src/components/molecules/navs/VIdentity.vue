<template>
  <VCluster gap="sm" align="center">
    <VButton
      v-if="showBack"
      attention="primary"
      border="none"
      size="sm"
      icon-name="ArrowLeft"
      icon-only
      @click="emit('back')"
    />
    <VBox width="px" height="4"/>
    <VStack gap="none">
      <VTypography size="xs" weight="bold" class="uppercase">
        {{ title }}
      </VTypography>
      <VTypography size="sm" weight="semibold">
        {{ section }}
      </VTypography>
    </VStack>
  </VCluster>
</template>

<script setup lang="ts">
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';

export interface VIdentityProps {
  showBack: boolean;
  title: string;
  section?: string;
};

withDefaults(defineProps<VIdentityProps>(), {
  showBack: false
});

const emit = defineEmits<{
  (e: 'back'): void;
}>();
</script>