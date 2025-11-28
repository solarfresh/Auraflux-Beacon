<template>
  <div class="flex flex-col h-full space-y-6">

    <Text tag="h2" size="xl" weight="bold" color="gray-900" class="border-b pb-3 flex items-center space-x-2">
      <Icon name="Target" type="solid" size="md" color="indigo-600" />
      <Text tag="span" size="xl" weight="bold" color="gray-900">Initiation Phase Output</Text>
    </Text>

    <div class="space-y-2">
      <ProgressDisplay
        :percentage="completionPercentage"
        label="Definition Progress"
        description="of key elements locked."
        color="indigo"
      />
    </div>

    <div class="space-y-3">
      <Text tag="h3" size="lg" weight="semibold" color="gray-800" class="flex items-center justify-between">
        <Text tag="span" size="lg" weight="semibold" color="gray-800">Core Keywords & Elements</Text>
        <Text tag="span" size="xs" weight="medium" color="indigo-600">({{ lockedKeywordsCount }}/{{ keywords.length }}) Locked</Text>
      </Text>

      <ul class="space-y-3">
        <Text
          tag="li"
          v-for="(keyword, index) in keywords"
          :key="index"
          class="flex items-center justify-between p-3 border rounded-lg transition"
          :class="{
            'bg-indigo-50 border-indigo-200': keyword.status === 'Locked',
            'bg-white border-gray-200': keyword.status === 'Draft'
          }"
        >
          <div class="flex flex-col">
            <Text tag="span" size="base" weight="medium" :color="keyword.status === 'Locked' ? 'indigo-700' : 'gray-800'">
              {{ keyword.text }}
            </Text>
            <Text tag="span" size="xs" color="gray-500">
              Source: {{ keyword.source }}
            </Text>
          </div>

          <Button
            v-if="keyword.status === 'Draft'"
            @click="promptAndEmitKeywordUpdate(index, keyword.text)"
            variant="tertiary"
            size="sm"
          >
            <Icon name="PencilSquare" type="outline" size="sm" color="gray-600" />
          </Button>
          <Icon v-else name="CheckCircle" type="solid" size="md" color="indigo-600" />
        </Text>
      </ul>
    </div>

    <div class="space-y-3">
      <Text tag="h3" size="lg" weight="semibold" color="gray-800">
        Research Scope
      </Text>
      <ul class="space-y-2 text-sm text-gray-700">
        <Text
          tag="li"
          v-for="(item, index) in scope"
          :key="index"
          class="flex justify-between"
        >
          <Text tag="span" size="sm" weight="medium" color="gray-600">{{ item.label }}:</Text>
          <Text tag="span" size="sm" color="gray-700">{{ item.value || 'N/A' }}</Text>
        </Text>
      </ul>
    </div>

    <div class="mt-auto pt-6 border-t border-gray-200 space-y-4">
      <Text tag="h3" size="lg" weight="semibold" color="gray-800">
        Final Question Statement
      </Text>

      <div
        class="p-4 rounded-lg border-2 border-dashed"
        :class="finalQuestion ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-100'"
      >
        <Text tag="p" size="base" :weight="finalQuestion ? 'semibold' : 'normal'" :color="finalQuestion ? 'green-800' : 'gray-500'">
          {{ finalQuestion || 'Question not yet finalized. Keep refining in the chat.' }}
        </Text>
      </div>

      <Button
        @click="finalizeQuestion"
        :disabled="!finalQuestion || isQuestionLocked"
        variant="primary"
        class="w-full"
      >
        <Text tag="span" size="base" weight="medium" color="current">
          <Text tag="span" size="base" weight="medium" color="current" v-if="isQuestionLocked">Question Locked ✅</Text>
          <Text tag="span" size="base" weight="medium" color="current" v-else>Lock Final Question</Text>
        </Text>
      </Button>
    </div>

  </div>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import ProgressDisplay from '@/components/molecules/ProgressDisplay.vue'; // 🌟 NEW IMPORT
import { computed, ref } from 'vue';
import type { Keyword, ScopeItem } from '@/interfaces/search';

// Local state for demonstration (In a real app, this should probably come from the store)
const isQuestionLocked = ref(false);

// --- Props ---
const props = defineProps<{
  keywords: Keyword[];
  scope: ScopeItem[];
  finalQuestion: string;
}>();

// --- Emits ---
const emit = defineEmits<{
  (e: 'keywordUpdate', payload: { index: number, newText: string }): void;
  (e: 'questionFinalize', question: string): void;
}>();


// --- Computed Properties ---

const lockedKeywordsCount = computed(() => {
  return props.keywords.filter(k => k.status === 'Locked').length;
});

// Calculation remains the same, providing the percentage for the ProgressDisplay
const completionPercentage = computed(() => {
  const totalElements = props.keywords.length + props.scope.length;
  if (totalElements === 0) return 0;

  const lockedElements = props.keywords.filter(k => k.status === 'Locked').length +
                         props.scope.filter(s => s.status === 'Locked').length;

  // Final question adds the last 20%
  const basePercentage = (lockedElements / totalElements) * 80;

  if (props.finalQuestion && lockedElements >= 2) {
    return Math.min(100, Math.round(basePercentage + 20));
  }
  return Math.round(basePercentage);
});


// --- Methods ---

/**
 * Simulates the edit action by prompting the user and emitting the update event.
 */
const promptAndEmitKeywordUpdate = (index: number, currentText: string) => {
  // NOTE: This uses a blocking browser prompt for simulation.
  // In production, this would open a non-blocking modal or inline input field.
  const newText = prompt(`Edit and lock keyword: ${currentText}`, currentText);
  if (newText && newText !== currentText) {
    emit('keywordUpdate', { index, newText });
  }
};

/**
 * Handles the locking of the final question statement.
 */
const finalizeQuestion = () => {
  if (props.finalQuestion && !isQuestionLocked.value) {
    isQuestionLocked.value = true;
    emit('questionFinalize', props.finalQuestion);
    // Note: The alert is removed in a clean production version.
  }
};
</script>