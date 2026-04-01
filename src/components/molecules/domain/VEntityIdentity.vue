<template>
  <VCluster gap="sm" align="center">
    <VButton
      v-if="showBack"
      variant="tertiary"
      size="sm"
      icon-name="ArrowLeft"
      icon-only
      @click="emit('back')"
    />
    <VBox width="px" height="4" background="slate-50" />
    <VStack gap="none">
      <VTypography size="xs" weight="bold" color="indigo-600" class="uppercase">
        Mission
      </VTypography>
      <VTypography size="sm" weight="semibold" color="slate-900">
        {{ title }}
      </VTypography>
    </VStack>
  </VCluster>
</template>

<script setup lang="ts">
import VButton from '@/components/atoms/buttons/VButton.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import { useRouter } from 'vue-router';

const router = useRouter();

withDefaults(defineProps<{
  showBack: boolean;
  title?: string;
}>(), {
  showBack: false
});

const emit = defineEmits<{
  (e: 'back'): void;
}>();
</script>