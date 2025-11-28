<template>
  <div class="space-y-6">
    <Text tag="p" size="base" color="gray-700">
      Use this space to quickly jot down any **vague thoughts, anxieties, or initial hunches** about your topic. The Reflector Agent will track these notes and resurface them later in the process for validation.
    </Text>

    <form @submit.prevent="handleSubmit" class="space-y-4">

      <div>
        <Text tag="label" for="reflection-text" size="sm" weight="medium" color="gray-700" class="block mb-1">
          Your Reflection / Thought
        </Text>
        <Textarea
          id="reflection-text"
          v-model="reflectionText"
          :rows="5"
          required
          placeholder="e.g., I'm worried this topic is too broad, or: I think the key might be finding policy documents, not just articles."
          size="md"
        />
      </div>

      <div>
        <Text tag="label" for="reflection-category" size="sm" weight="medium" color="gray-700" class="block mb-1">
          Category
        </Text>
        <Select
          id="reflection-category"
          v-model="category"
          size="md"
        >
          <option value="Uncertainty">Uncertainty/Anxiety</option>
          <option value="InitialHunch">Initial Assumption/Hypothesis</option>
          <option value="ScopeWorry">Scope/Boundary Concern</option>
          <option value="NextStepIdea">Idea for Next Steps</option>
        </Select>
        </div>

      <div class="flex justify-end pt-2">
        <Button
          type="submit"
          variant="secondary"
          :disabled="!reflectionText.trim()"
        >
          <Text tag="span" size="base" weight="medium" color="current">
            Log Thought
          </Text>
        </Button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';
import Select from '@/components/atoms/Select.vue';
import Text from '@/components/atoms/Text.vue';
import Textarea from '@/components/atoms/Textarea.vue';
import { ref } from 'vue';

const reflectionText = ref('');
const category = ref('Uncertainty'); // Default category

const emit = defineEmits<{
  /**
   * Emitted when the user logs a reflection.
   */
  (e: 'logThought', thought: string, category: string): void;
}>();

const handleSubmit = () => {
  if (reflectionText.value.trim()) {
    // Emit parameters explicitly by name for clarity, matching store action
    emit('logThought', reflectionText.value.trim(), category.value);

    // Reset form fields after submission
    reflectionText.value = '';
    category.value = 'Uncertainty';
  }
};
</script>