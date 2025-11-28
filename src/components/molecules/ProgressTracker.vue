<template>
  <div class="bg-indigo-700 text-white shadow-md flex-shrink-0">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
      <div class="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">

        <div class="flex items-center space-x-3">
          <Icon name="LightBulb" type="solid" size="md" color="white" />

          <Text tag="span" size="base" weight="medium" color="white">
            ISP Stage: {{ currentStage }}
          </Text>
        </div>

        <div class="w-full md:w-2/3 lg:w-1/2 flex items-center space-x-3">

          <Text tag="span" size="sm" color="white" class="flex-shrink-0 whitespace-nowrap hidden sm:block">
            <span v-if="currentStage === 'Initiation'">Feeling Unsure is Normal.</span>
            <span v-else-if="currentStage === 'Formulation'">Finding Focus...</span>
            <span v-else>Progress:</span>
          </Text>

          <div class="w-full bg-indigo-500 rounded-full h-2.5">
            <div
              class="bg-white h-2.5 rounded-full transition-all duration-700 ease-out"
              :style="{ width: `${completionPercentage}%` }"
            ></div>
          </div>

          <Text tag="span" size="sm" weight="semibold" color="white" class="flex-shrink-0">
            {{ completionPercentage }}%
          </Text>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/atoms/Icon.vue'; // Assuming Icon.vue import path
import Text from '@/components/atoms/Text.vue'; // Assuming Text.vue import path


const props = defineProps({
  /**
   * The current stage of the Kuhlthau ISP process.
   * e.g., 'Initiation', 'Selection', 'Exploration', 'Formulation', 'Collection', 'Presentation'.
   */
  currentStage: {
    type: String,
    required: true,
  },

  /**
   * The overall completion percentage for the current stage or project.
   * Ranging from 0 to 100.
   */
  completionPercentage: {
    type: Number,
    required: true,
    validator: (value: number) => value >= 0 && value <= 100,
  }
})
</script>