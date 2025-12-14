import { apiService } from '@/api/apiService';
import type { FeasibilityStatus, ReflectionLogEntry, TopicKeyword, TopicScopeElement } from '@/interfaces/initiation';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref } from 'vue';

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

    const reflectionLogs = ref<ReflectionLogEntry[]>([]);

    const resourceSuggestion = ref<string>('');

    const stabilityScore = ref<number>(0);

    const topicKeywords = ref<TopicKeyword[]>([]);

    const topicScope = ref<TopicScopeElement[]>([]);

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

    async function createOrUpdateReflection(logId: string, title: string, content: string, status: string) {
      let response = null;
      if (logId.includes('new')) {
        response = await apiService.workflows.reflection.create(title, content, status);
      } else {
        response = await apiService.workflows.reflection.update(logId, title, content, status);
      }

      if (response.data) {
        reflectionLogs.value = response.data.map((log) => {
          return {
            id: log.id,
            title: log.title,
            content: log.content,
            createdAt: log.created_at,
            updatedAt: log.updated_at,
            status: log.status,
          }
        });
      }
    }

    async function createOrUpdateTopicKeywords(keywordId: string, text: string, status: string) {
      let response = null;
      if (keywordId) {
        response = await apiService.workflows.keywords.update(keywordId, text, status);
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
        response = await apiService.workflows.scopes.update(scopeElementId, label, value, status);
      } else {
        response = await apiService.workflows.scopes.create(label, value, status);
      }

      if (response.data) {
        topicScope.value = response.data;
      }
    }

    async function getMessages() {
      let response = await apiService.workflows.initiation.getChatHistory();
      if (response.data) {
        chatMessages.value = response.data;
      }
    }

    async function getRefinedTopic() {
      let response = await apiService.workflows.initiation.getRefinedTopic();
      if (response.data) {
        feasibilityStatus.value = response.data.feasibility_status;
        finalQuestion.value = response.data.final_research_question;
        resourceSuggestion.value = response.data.resource_suggestion;
        stabilityScore.value = response.data.stability_score;
        topicKeywords.value = response.data.keywords;
        topicScope.value = response.data.scope;
      }
    }

    async function getReflection() {
      let response = await apiService.workflows.reflection.get();
      if (response.data) {
        reflectionLogs.value = response.data.map((log) => {
          return {
            id: log.id,
            title: log.title,
            content: log.content,
            createdAt: log.created_at,
            updatedAt: log.updated_at,
            status: log.status,
          }
        });
      }
    }

		// --- Return public API ---
    return {
        // State
        chatMessages,
        feasibilityStatus,
        finalQuestion,
				isTyping,
        latestReflection,
        reflectionLogs,
        resourceSuggestion,
        stabilityScore,
        topicKeywords,
        topicScope,
        // Getters
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
