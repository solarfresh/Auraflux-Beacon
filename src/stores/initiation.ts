import { apiService } from '@/api/apiService';
import type { ProcessedKeyword, ProcessedScope } from '@/interfaces/initiation';
import { FeasibilityStatus } from '@/interfaces/core';
import type { ReflectionLogEntry } from '@/interfaces/workflow';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref } from 'vue';

import type {
  ChatMessage
} from '@/interfaces/core';

export const useInitiativeStore = defineStore('intiation', () => {
    // --- State (Refs) ---

    /** The list of all chat messages in the initiation stage. */
    const chatMessages = ref<ChatMessage[]>([]);

    const feasibilityStatus = ref<FeasibilityStatus>('LOW');

    const finalQuestion = ref<string>('');

		/** Flag to indicate if a message is in recieving. */
    const isTyping = ref(false);

    const reflectionLogs = ref<ReflectionLogEntry[]>([]);

    const resourceSuggestion = ref<string>('');

    const stabilityScore = ref<number>(0);

    const topicKeywords = ref<ProcessedKeyword[]>([]);

    const topicScope = ref<ProcessedScope[]>([]);

		// --- Getters (Computed) ---

    const latestReflection = computed(() => reflectionLogs.value.at(0)?.content || '');

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
            sequenceNumber: chatMessages.value.length + 1,
        } as ChatMessage); // Type assertion for strict compliance
        chatMessages.value.push({
          id: uuidv4(),
          role: 'system',
          content: 'Agent is typing...',
          name: agentName,
          timestamp: new Date().toISOString(),
          sequenceNumber: chatMessages.value.length + 2,
        } as ChatMessage);
        apiService.workflows.base.chat(messageContent, agentName);
    }

    async function createOrUpdateReflection(logId: string, title: string, content: string, status: string) {
      let response = null;
      if (logId.includes('new')) {
        response = await apiService.workflows.base.createReflectionLog(title, content, status);
      } else {
        response = await apiService.workflows.base.updateReflectionLogById(logId, title, content, status);
      }

      if (response.data) {
        reflectionLogs.value = response.data;
      }
    }

    async function createOrUpdateTopicKeywords(keywordId: string, text: string, status: string) {
      let response = null;
      if (keywordId) {
        response = await apiService.knowledge.keywords.update(keywordId, text, status);
      } else {
        response = await apiService.workflows.keywords.create(text, status);
      }

      if (response.data) {
        topicKeywords.value = response.data;
      }
    }

    async function createOrUpdateTopicScopes(scopeElementId: string, label: string, value: string, status: string) {
      let response = null;
      if (scopeElementId) {
        response = await apiService.knowledge.scopes.update(scopeElementId, label, value, status);
      } else {
        response = await apiService.workflows.scopes.create(label, value, status);
      }

      if (response.data) {
        topicScope.value = response.data;
      }
    }

    async function getMessages() {
      let response = await apiService.workflows.base.getChatHistory();
      if (response.data) {
        chatMessages.value = response.data;
      }
    }

    async function getRefinedTopic() {
      let response = await apiService.workflows.base.getRefinedTopic();
      if (response.data) {
        feasibilityStatus.value = response.data.feasibilityStatus;
        finalQuestion.value = response.data.finalQuestion;
        resourceSuggestion.value = response.data.resourceSuggestion || '';
        stabilityScore.value = response.data.stabilityScore;
        topicKeywords.value = response.data.keywords || [];
        topicScope.value = response.data.scope;
      }
    }

    async function getReflection() {
      let response = await apiService.workflows.base.getReflectionLog();
      if (response.data) {
        reflectionLogs.value = response.data;
      }
    }

		// --- Return public API ---
    return {
        // State
        chatMessages,
        feasibilityStatus,
        finalQuestion,
				isTyping,
        reflectionLogs,
        resourceSuggestion,
        stabilityScore,
        topicKeywords,
        topicScope,
        // Getters
        latestReflection,
        // Actions
        addMessage,
        createOrUpdateReflection,
        createOrUpdateTopicKeywords,
        createOrUpdateTopicScopes,
        getMessages,
        getRefinedTopic,
        getReflection,
    };
})
