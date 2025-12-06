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
            <Text tag="span" color="white" v-if="currentStage === 'Initiation'">Feeling Unsure is Normal.</Text>
            <Text tag="span" color="white" v-else-if="currentStage === 'Formulation'">Finding Focus...</Text>
            <Text tag="span" color="white" v-else>Progress:</Text>
          </Text>

          <div class="w-full bg-indigo-500 rounded-full h-2.5">
            <BarSegment
              :width="completionPercentage"
              color="white"
            />
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
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import BarSegment from '@/components/atoms/BarSegment.vue';

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