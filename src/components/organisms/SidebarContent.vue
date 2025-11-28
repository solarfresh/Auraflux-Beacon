<template>
  <div class="flex flex-col space-y-6">

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
            // Highlight Locked state
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
          {{ finalQuestion || 'Question not yet finalized. Refine in the chat to see the draft here.' }}
        </Text>
      </div>

      </div>

  </div>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import ProgressDisplay from '@/components/molecules/ProgressDisplay.vue';
import { computed } from 'vue';

// --- Interface Types ---
interface Keyword {
  text: string;
  status: 'Locked' | 'Draft';
  source: string;
}

interface ScopeItem {
  label: string;
  value: string;
  status: 'Locked' | 'Draft';
}

// --- Props ---
const props = defineProps<{
  /** List of keywords, status, and source. */
  keywords: Keyword[];

  /** List of scope items (e.g., Geographical, Timeframe). */
  scope: ScopeItem[];

  /** The final synthesized research question string (Used for display only). */
  finalQuestion: string;
}>();

// --- Emits ---
const emit = defineEmits<{
  /** Emitted when a user attempts to manually edit/lock a keyword. */
  (e: 'keywordUpdate', payload: { index: number, newText: string }): void;
  // REMOVED: 'questionFinalize' event, as this is now handled by ActionBar.
}>();


// --- Computed Properties ---

/** Calculates the number of locked keywords for the progress tracker. */
const lockedKeywordsCount = computed(() => {
  return props.keywords.filter(k => k.status === 'Locked').length;
});

/** Calculates overall completion percentage for the sidebar view. */
const completionPercentage = computed(() => {
  const totalElements = props.keywords.length + props.scope.length;
  if (totalElements === 0) return 0;

  const lockedElements = props.keywords.filter(k => k.status === 'Locked').length +
                         props.scope.filter(s => s.status === 'Locked').length;

  const basePercentage = (lockedElements / totalElements) * 80;

  // Final question presence adds the last 20%
  if (props.finalQuestion && lockedElements >= 1) {
    return Math.min(100, Math.round(basePercentage + 20));
  }
  return Math.round(basePercentage);
});


// --- Methods ---

/**
 * Simulates the edit action by prompting the user and emitting the update event.
 * NOTE: The prompt should be replaced by a proper UI modal/inline editor in production.
 */
const promptAndEmitKeywordUpdate = (index: number, currentText: string) => {
  const newText = prompt(`Edit and lock keyword: ${currentText}`, currentText);
  if (newText && newText.trim() !== currentText) {
    emit('keywordUpdate', { index, newText: newText.trim() });
  }
};

</script>