import { apiService } from '@/api/apiService';
import type { FeasibilityStatus, TopicKeyword, TopicScopeElement } from '@/interfaces/workflow';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { ref } from 'vue';

import type {
  ChatMessage
} from '@/interfaces/initiation';

export const useInitiativeStore = defineStore('intiation', () => {
    // --- State (Refs) ---

    /** The list of all chat messages in the initiation stage. */
    const chatMessages = ref<ChatMessage[]>([]);

    const feasibilityStatus = ref<FeasibilityStatus>('LOW');

    const finalQuestion = ref<string>('');

		/** Flag to indicate if a message is in recieving. */
    const isTyping = ref(false);

    const latestReflection = ref<string>('');

    const resourceSuggestion = ref<string>('');

    const stabilityScore = ref<number>(0);

    const topicKeywords = ref<TopicKeyword[]>([]);

    const topicScope = ref<TopicScopeElement[]>([]);

		// --- Getters (Computed) ---
		// --- Actions (Functions) ---

    /**
     * Adds a new message to the chat history.
     */
    async function addMessage(messageContent: string) {
        const agentName = 'ExplorerAgent';
        isTyping.value = true;
        chatMessages.value.push({
            id: uuidv4(),
            role: 'user',
            content: messageContent,
						name: 'User',
            timestamp: new Date().toISOString(),
            sequence_number: chatMessages.value.length + 1,
        } as ChatMessage); // Type assertion for strict compliance
        chatMessages.value.push({
          id: uuidv4(),
          role: 'system',
          content: 'Agent is typing...',
          name: agentName,
          timestamp: new Date().toISOString(),
          sequence_number: chatMessages.value.length + 2,
        } as ChatMessage);
        apiService.workflows.initiation.chat(messageContent, agentName);
    }

    async function getMessages() {
      let response = await apiService.workflows.initiation.getChatHistory();
      if (response) {
        chatMessages.value = response.data;
      }
    }

    async function getRefinedTopic() {
      topicKeywords.value = [
        { text: 'Artificial Intelligence', status: 'LOCKED'},
        { text: 'Job Displacement', status: 'DRAFT'},
        { text: 'Retraining Programs', status: 'DRAFT'},
      ];

      topicScope.value = [
        { label: 'Geographical Focus', value: 'Developed Nations (USA, EU)', status: 'LOCKED' },
        { label: 'Timeframe', value: '2020 - Present', status: 'DRAFT' },
        { label: 'Target Demographic', value: 'Blue-Collar Workers', status: 'LOCKED' },
      ];

      finalQuestion.value = 'How have AI advancements since 2020 impacted job displacement rates and the need for government-funded retraining programs in the US and EU?';
      feasibilityStatus.value = 'MEDIUM';
      latestReflection.value = 'Feeling overwhelmed by the scope, need to narrow down the definition of "Blue-Collar".';
      resourceSuggestion.value = '';
      stabilityScore.value = 3;
    }

		// --- Return public API ---
    return {
        // State
        chatMessages,
        feasibilityStatus,
        finalQuestion,
				isTyping,
        latestReflection,
        resourceSuggestion,
        stabilityScore,
        topicKeywords,
        topicScope,
        // Getters
        // Actions
        addMessage,
        getMessages,
        getRefinedTopic,
    };
})
