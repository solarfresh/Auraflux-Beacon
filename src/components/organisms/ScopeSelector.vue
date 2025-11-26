<template>
  <div class="space-y-8">

    <div class="p-5 border rounded-xl bg-blue-50">
      <Text tag="h3" size="lg" weight="semibold" color="blue-800" class="mb-4 flex items-center">
        <Icon name="puzzle-piece" type="solid" size="md" color="blue-600" class="mr-2" />
        1. Select Core Strategic Tension (The Dichotomy)
      </Text>

      <Text tag="p" size="sm" color="gray-600" class="mb-4">
        Choose the fundamental conflict your organization is currently facing. This defines the adversarial roles in the analysis.
      </Text>

      <div class="mb-6 flex justify-end">
        <Text tag="label" class="flex items-center space-x-2 text-sm cursor-pointer">
          <Checkbox
            v-model="isManualMode"
            @change="selectedDichotomyId = null"
          />
          <Text tag="span" size="sm" :weight="isManualMode ? 'bold' : 'normal'" :color="isManualMode ? 'indigo-700' : 'gray-700'">
            Enter Dichotomy and Roles Manually
          </Text>
        </Text>
      </div>

      <div v-if="!isManualMode" class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div v-if="isLoading" class="col-span-full text-center p-4 text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm">
          <Text tag="p" size="sm" color="gray-500">
            Analyzing knowledge base to suggest dichotomies...
          </Text>
        </div>
        <div v-else-if="dynamicDichotomies.length === 0" class="col-span-full text-center p-4 text-gray-500 bg-white rounded-lg border border-gray-200 shadow-sm">
          <Text tag="p" size="sm" color="gray-500">
            No specific strategic tensions were automatically identified from the search results. Please use the manual entry option above.
          </Text>
        </div>

        <div
          v-for="dichotomy in dynamicDichotomies"
          :key="dichotomy.id"
          :class="[
            'p-4 rounded-lg border-2 cursor-pointer transition-all duration-200',
            selectedDichotomyId === dichotomy.id
              ? 'border-indigo-600 ring-4 ring-indigo-100 bg-white shadow-lg'
              : 'border-gray-200 hover:border-gray-400'
          ]"
          @click="selectedDichotomyId = dichotomy.id"
        >
          <Text tag="h4" size="base" weight="bold" :color="selectedDichotomyId === dichotomy.id ? 'indigo-700' : 'gray-800'">
            {{ dichotomy.name }}
          </Text>
          <Text tag="p" size="xs" color="gray-500" class="mt-1">
            {{ dichotomy.description }}
          </Text>
        </div>
      </div>

      <div v-else class="space-y-4 p-4 bg-white rounded-lg border border-indigo-300 shadow-md">
        <div class="space-y-2">
          <Text tag="label" size="base" weight="medium" color="gray-700" for="manual-dichotomy" class="block">
            Manual Dichotomy Name (e.g., Speed vs. Security)
          </Text>
          <Input
            id="manual-dichotomy"
            v-model="manualDichotomyName"
            type="text"
            placeholder="Enter the core strategic tension name"
          />
          <Text v-if="manualDichotomyValidation" tag="p" size="xs" color="red-500">
             {{ manualDichotomyValidation }}
          </Text>
        </div>
        <div class="space-y-2">
          <Text tag="label" size="base" weight="medium" color="gray-700" for="manual-roles" class="block">
            Conflicting Agents Assigned (Comma-separated, e.g., CTO, Legal Agent, Strategy Analyst)
          </Text>
          <Textarea
            id="manual-roles"
            v-model="manualRolesInput"
            :rows="3"
            placeholder="Enter agent roles separated by commas"
          />
           <Text tag="p" size="xs" color="gray-500">
            Ensure you define at least **two** distinct opposing roles.
          </Text>
          <Text v-if="manualRolesValidation" tag="p" size="xs" color="red-500">
             {{ manualRolesValidation }}
          </Text>
        </div>
      </div>
    </div>

    <div v-if="selectedDichotomy" class="p-5 border rounded-xl bg-white shadow-inner">
      <Text tag="h3" size="lg" weight="semibold" color="gray-800" class="mb-4 flex items-center">
        <Icon name="users" type="solid" size="md" color="gray-600" class="mr-2" />
        2. Confirm Agents and Define Question
      </Text>

      <div class="mb-5">
        <Text tag="p" size="base" weight="medium" color="gray-700" class="mb-2">
          Conflicting Agents Assigned:
        </Text>
        <div class="flex flex-wrap gap-3">
          <Text
            tag="span"
            v-for="role in selectedDichotomy.roles"
            :key="role"
            class="px-3 py-1 bg-green-100 rounded-full text-sm font-medium border border-green-300"
            size="sm"
            color="green-800"
          >
            {{ role }}
          </Text>
        </div>
      </div>

      <Text tag="label" size="base" weight="medium" color="gray-700" for="focused-question" class="block mb-2">
        Define the single, focused question for the Agents to answer:
      </Text>
      <Textarea
        id="focused-question"
        v-model="focusedQuestion"
        :rows="3"
        placeholder="E.g., Given the Speed vs. Security tension, should we implement mandatory two-factor authentication for all new internal systems?"
        size="md"
      />

      <Text v-if="questionValidation" tag="p" size="sm" color="red-500" class="mt-1">
        {{ questionValidation }}
      </Text>
    </div>

    <div class="flex justify-center p-4">
      <Button
        variant="primary"
        size="lg"
        :disabled="!isFormValid"
        @click="finalizeScope"
      >
        <Icon name="arrow-right" type="solid" size="md" color="white" class="mr-2" />
        Run Opinion Collection (Step 3)
      </Button>
    </div>

  </div>
</template>

<script setup lang="ts">
import { apiService } from '@/api/apiService';
import Button from '@/components/atoms/Button.vue';
import Checkbox from '@/components/atoms/Checkbox.vue'; // <-- NEW IMPORT
import Icon from '@/components/atoms/Icon.vue';
import Input from '@/components/atoms/Input.vue';
import Text from '@/components/atoms/Text.vue';
import Textarea from '@/components/atoms/Textarea.vue';
import type { Dichotomy } from '@/interfaces/search';
import { useNotificationStore } from '@/stores/notification';
import { computed, onMounted, ref, watch } from 'vue';

const store = useNotificationStore();

// --- Component State ---
const selectedDichotomyId = ref<string | null>(null);
const focusedQuestion = ref<string>('');
const isManualMode = ref<boolean>(false);
const manualDichotomyName = ref<string>('');
const manualRolesInput = ref<string>('');
const dynamicDichotomies = ref<Dichotomy[]>([]);
const isLoading = ref<boolean>(true);

onMounted(async () => {
    try {
        isLoading.value = true
        let response = await apiService.workflows.dichotomies.get();
        if (response.data.length > 0) {
          dynamicDichotomies.value = response.data;
          isLoading.value = false
        }
    } catch (error) {
        console.error("Failed to load suggested dichotomies:", error);
    }
});

watch(() => store.notifications['dichotomy_suggestions_complete'], (newVal) => {
  console.log('dichotomy_suggestions_complete results');
  console.log(newVal);
  if (newVal) {
    isLoading.value = false;
  }
})

// --- Computed Properties (Unchanged) ---

const selectedDichotomy = computed(() => {
    if (isManualMode.value) {
        const rolesArray = manualRolesInput.value.split(',').map(r => r.trim()).filter(r => r.length > 0);
        return {
            id: 'manual',
            name: manualDichotomyName.value.trim(),
            description: 'User-defined custom strategic tension.',
            roles: rolesArray,
        } as Dichotomy;
    }
    return dynamicDichotomies.value.find(d => d.id === selectedDichotomyId.value) || null;
});

const manualDichotomyValidation = computed(() => {
    if (isManualMode.value && manualDichotomyName.value.trim().length < 5) {
        return 'The dichotomy name must be descriptive (min 5 characters).';
    }
    return null;
});

const manualRolesValidation = computed(() => {
    if (isManualMode.value && selectedDichotomy.value && selectedDichotomy.value.roles.length < 2) {
        return 'You must define at least two conflicting agent roles.';
    }
    return null;
});

const questionValidation = computed(() => {
    if (!focusedQuestion.value.trim()) {
        return 'The focused question is mandatory to run the analysis.';
    }
    if (focusedQuestion.value.length < 20) {
        return 'Please provide a more detailed question (minimum 20 characters).';
    }
    return null;
});

const isFormValid = computed(() => {
    const baseValid = selectedDichotomy.value !== null && questionValidation.value === null;

    if (isManualMode.value) {
        return baseValid && manualDichotomyValidation.value === null && manualRolesValidation.value === null;
    }

    return baseValid;
});

// --- Methods and Actions (Unchanged) ---
const emit = defineEmits(['scopeDefined']);

const finalizeScope = () => {
    if (!isFormValid.value || !selectedDichotomy.value) return;

    const scopeData = {
        dichotomy: selectedDichotomy.value.name,
        roles: selectedDichotomy.value.roles,
        question: focusedQuestion.value.trim(),
    };

    emit('scopeDefined', scopeData);

    console.log('Scope Finalized:', scopeData);
};
</script>