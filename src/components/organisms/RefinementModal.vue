<template>
  <div class="flex flex-col h-full">
    <div class="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex items-start space-x-3">
      <Icon :name="config.icon" size="sm" :color="config.iconColor" class="mt-0.5" />
      <div>
        <Text tag="p" size="sm" color="indigo-900" weight="semibold" class="mb-1">
          Refining {{ config.title }}
        </Text>
        <Text tag="p" size="xs" color="indigo-700" class="leading-relaxed">
          {{ config.description }}
        </Text>
      </div>
    </div>

    <div class="flex-1">
      <component
        :is="config.component"
        v-if="initialData !== undefined"
        :initial-value="initialData"
        @save="handleSave"
        @cancel="$emit('close-modal')"
      />
    </div>

    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { ManagementType } from '@/interfaces/exploration';

// Atoms
import Text from '@/components/atoms/Text.vue';
import Icon from '@/components/atoms/Icon.vue';

// Organisms
import FinalQuestionEditor from '@/components/organisms/FinalQuestionEditor.vue';
import KeywordListRefinementForm from '@/components/organisms/KeywordListRefinementForm.vue';
import ScopeListRefinementForm from '@/components/organisms/ScopeListRefinementForm.vue';

const props = defineProps<{
  type: ManagementType;
  initialData: any;
}>();

const emit = defineEmits<{
  (e: 'close-modal'): void;
  (e: 'update-focus', type: ManagementType, value: any): void;
}>();

// --- CONFIGURATION ---
const config = computed(() => {
  const mapping = {
    'final-question': {
      title: 'Research Question',
      icon: 'QuestionMarkCircle',
      iconColor: 'indigo-600',
      description: 'Review and sharpen your core question based on the insights discovered during exploration.',
      component: FinalQuestionEditor
    },
    'keyword': {
      title: 'Keywords',
      icon: 'Hashtag',
      iconColor: 'purple-600',
      description: 'Manage the terms that define your research boundaries and AI-assisted discovery.',
      component: KeywordListRefinementForm
    },
    'scope': {
      title: 'Research Scope',
      icon: 'ArrowsPointingOut',
      iconColor: 'emerald-600',
      description: 'Update inclusion and exclusion criteria to keep your workspace focused.',
      component: ScopeListRefinementForm
    }
  };
  return mapping[props.type as keyof typeof mapping] || mapping['final-question'];
});

// --- HANDLERS ---
function handleSave(newValue: any) {
  emit('update-focus', props.type, newValue);
}
</script>