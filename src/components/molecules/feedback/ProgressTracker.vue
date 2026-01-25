<template>
  <div class="bg-indigo-700 text-white shadow-md flex-shrink-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">

        <div class="flex items-center space-x-3">
          <Icon name="LightBulb" type="solid" size="md" />
          <Text tag="span" size="base" weight="medium">
            ISP Stage: {{ currentStage }}
          </Text>
        </div>

        <div class="w-full md:w-2/3 lg:w-1/2 flex items-center space-x-3">

          <Text
            tag="span"
            size="sm"
            class="flex-shrink-0 whitespace-nowrap hidden sm:block opacity-90"
          >
            {{ stageMessage }}
          </Text>

          <div class="w-full bg-indigo-500/50 rounded-full h-2.5 overflow-hidden">
            <BarSegment
              :width="completionPercentage"
              color="white"
            />
          </div>

          <Text tag="span" size="sm" weight="semibold" class="flex-shrink-0 w-10 text-right">
            {{ completionPercentage }}%
          </Text>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import Icon from '@/components/atoms/data-display/Icon.vue';
import Text from '@/components/atoms/data-display/Text.vue';
import BarSegment from '@/components/atoms/data-display/BarSegment.vue';

/**
 * ProgressTracker Molecule
 * Visualizes the Kuhlthau ISP stage and overall task completion.
 */
const props = defineProps({
  /** Current ISP stage name */
  currentStage: {
    type: String,
    required: true,
  },
  /** Completion value between 0 and 100 */
  completionPercentage: {
    type: Number,
    required: true,
    validator: (value: number) => value >= 0 && value <= 100,
  }
});

/** Maps ISP stages to user-friendly status messages */
const stageMessage = computed(() => {
  switch (props.currentStage) {
    case 'Initiation': return 'Feeling Unsure is Normal.';
    case 'Formulation': return 'Finding Focus...';
    case 'Exploration': return 'Seeking Information...';
    default: return 'Progress:';
  }
});
</script>