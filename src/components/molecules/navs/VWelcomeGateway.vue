<template>
  <VBox padding="xl" class="max-w-3xl mx-auto text-center" :background="'white'">
    <VStack gap="xl" align="center">
      <VStack gap="xs">
        <VTypography variant="display" tag="h1" color="slate-900">
          {{ greeting }}
        </VTypography>
        <VTypography variant="base" color="slate-500">
          Declare your mindset to prime your mission control.
        </VTypography>
      </VStack>

      <VStack gap="sm">
        <VButton
          v-for="intent in intents"
          :key="intent.id"
          :variant="selectedIntent === intent.id ? 'primary' : 'outline'"
          rounded="full"
          @click="handleIntentSelection(intent)"
        >
          <VCluster gap="xs">
            <VIcon :name="intent.icon" size="sm" />
            <VTypography variant="sm" tag="span" :color="selectedIntent === intent.id ? 'white' : 'slate-900'">
              {{ intent.label }}
            </VTypography>
          </VCluster>
        </VButton>
      </VStack>

      <VButton
        size="lg"
        color="indigo-600"
        class="w-full md:w-auto px-12"
        @click="$emit('launch', selectedIntent)"
      >
        LAUNCH MISSION CONTROL
      </VButton>
    </VStack>
  </VBox>
</template>

<script setup lang="ts">
import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
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

const handleIntentSelection = (intent: IntentOption) => {
  selectedIntent.value = selectedIntent.value === intent.id ? null : intent.id
}

</script>