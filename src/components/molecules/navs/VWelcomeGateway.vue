<template>
  <VBox padding="xl" class="max-w-3xl mx-auto text-center">
    <VStack gap="xl" align="center">
      <VStack gap="xs">
        <VTypography variant="display" tag="h1" color="slate-900">
          {{ greeting }}
        </VTypography>
        <VTypography variant="base" color="slate-500">
          Set your intent to prime the co-thinking session.
        </VTypography>
      </VStack>

      <VCluster gap="sm" justify="center">
        <VButton
          v-for="intent in intents"
          :key="intent.id"
          :variant="selectedIntent === intent.id ? 'primary' : 'outline'"
          rounded="full"
          @click="selectedIntent = intent.id"
        >
          <VCluster gap="xs">
            <VIcon :name="intent.icon" size="sm" />
            <VTypography variant="sm" tag="span">
              {{ intent.label }}
            </VTypography>
          </VCluster>
        </VButton>
      </VCluster>

      <VButton
        size="lg"
        color="indigo-600"
        :disabled="!selectedIntent"
        class="w-full md:w-auto px-12"
        @click="$emit('launch', selectedIntent)"
      >
        Start Session
      </VButton>
    </VStack>
  </VBox>
</template>

<script setup lang="ts">
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VButton from '@/components/atoms/VButton.vue';
import VIcon from '@/components/atoms/VIcon.vue';
import VTypography from '@/components/atoms/VTypography.vue';
import type { IntentOption } from '@/interfaces/user';
import { ref } from 'vue';

defineProps<{
  greeting: string;
  intents: IntentOption[];
}>();

const selectedIntent = ref<string | null>(null);

defineEmits<{
  (e: 'launch', intentId: string | null): void;
}>();
</script>