<template>
  <DualPaneWorkspaceTemplate>

    <template #status-tracker>
      <ProgressTracker :current-stage="currentStage" :completion-percentage="25" />
    </template>

    <template #sidebar>
      <SidebarContent
        :keywords="structuredOutput.keywords"
        :scope="structuredOutput.scope"
        :final-question="structuredOutput.finalQuestion"
        @keyword-update="handleKeywordUpdate"
        @question-finalize="handleFinalize"
      />
    </template>

    <template #chat-interface>
      <ChatInterface :messages="chatMessages" @send-message="handleSendMessage" />
    </template>

    <template #action-bar>
      <ActionBar
        :is-question-finalized="isQuestionFinalized"
        @reflect-start="handleReflect"
        @phase-transition="handlePhaseTransition"
      />
    </template>

  </DualPaneWorkspaceTemplate>

  <FullScreenModalTemplate
    :is-open="isReflecting"
    @close="isReflecting = false"
  >
    <template #header>
      Log a Thought (Reflector Agent)
    </template>
    <template #default>
      <ReflectionLogForm @log-thought="logThought" />
    </template>
  </FullScreenModalTemplate>
</template>

<script setup>
import { computed, ref } from 'vue';

import ActionBar from '@/components/molecules/ActionBar.vue';
import ProgressTracker from '@/components/molecules/ProgressTracker.vue';
import ReflectionLogForm from '@/components/molecules/ReflectionLogForm.vue';
import ChatInterface from '@/components/organisms/ChatInterface.vue';
import SidebarContent from '@/components/organisms/SidebarContent.vue';
import DualPaneWorkspaceTemplate from '@/components/templates/DualPaneWorkspaceTemplate.vue';
import FullScreenModalTemplate from '@/components/templates/FullScreenModalTemplate.vue';

// --- Page State (Mock Data) ---
const currentStage = ref('Initiation');
const isReflecting = ref(false);

const chatMessages = ref([
  { id: 1, type: 'agent', content: "Welcome! I'm the Clarifier Agent. Tell me about the general topic you want to explore. Don't worry about being precise yet!" },
  { id: 2, type: 'user', content: "I want to research Sustainable Fashion, maybe focusing on labor issues." },
  { id: 3, type: 'agent', content: "Got it. To refine this, The Validator Agent suggests focusing on a specific **Scope (e.g., Southeast Asia)** or a **Mechanism (e.g., Auditing Standards)**. Which one interests you more?" },
]);

const structuredOutput = ref({
  keywords: [
    { text: 'Sustainable Fashion', status: 'Locked', source: 'The Clarifier' },
    { text: 'Labor Rights', status: 'Locked', source: 'User Input' },
    { text: 'Southeast Asia', status: 'Draft', source: 'The Validator' },
  ],
  scope: [
    { label: 'Geographical', value: 'Southeast Asia', status: 'Draft' },
    { label: 'Timeframe', value: '2020 - Present', status: 'Draft' },
  ],
  finalQuestion: ''
});

// --- Computed Properties ---
const isQuestionFinalized = computed(() => {
  // Logic to check if the final question is sufficiently structured and locked
  return structuredOutput.value.finalQuestion.includes('how') &&
         structuredOutput.value.keywords.filter(k => k.status === 'Locked').length >= 3;
});

// --- Methods (Simulating Agent Interactions) ---

// A. Handle User Message
const handleSendMessage = (content) => {
  chatMessages.value.push({ id: Date.now(), type: 'user', content });

  // 2. Simulate Agent Response and Validator Update
  setTimeout(() => {
    if (content.toLowerCase().includes('auditing')) {
      structuredOutput.value.keywords.push({ text: 'Factory Auditing', status: 'Locked', source: 'Validator Agent' });
      structuredOutput.value.finalQuestion = "How effective are international brands' Factory Auditing Mechanisms in protecting labor rights in Southeast Asia?";
    }

    chatMessages.value.push({ id: Date.now() + 1, type: 'agent', content: `The Validator Agent has updated your keywords based on your focus on **${content}**. Review the sidebar for the new **Final Question** draft.` });
  }, 1000);
};

// B. Handle Sidebar Update (e.g., User manually corrects a keyword)
const handleKeywordUpdate = ({ index, newText }) => {
  if (structuredOutput.value.keywords[index]) {
    structuredOutput.value.keywords[index].text = newText;
    structuredOutput.value.keywords[index].status = 'Locked';
  }
};

// C. Handle Final Question Lock/Finalize
const handleFinalize = (question) => {
  structuredOutput.value.finalQuestion = question;
};

// F. Handle Reflection Modal
const handleReflect = () => {
  isReflecting.value = true;
};

const logThought = (thought) => {
  console.log('Thought logged by Reflector Agent:', thought);
  isReflecting.value = false;
};

// H. Phase Transition
const handlePhaseTransition = () => {
  if (isQuestionFinalized.value) {
    alert('Transitioning to Selection Phase with the final question: ' + structuredOutput.value.finalQuestion);
  }
};
</script>

<style scoped>
/* Tailwind utility classes are now mostly handled in the Template component */
</style>