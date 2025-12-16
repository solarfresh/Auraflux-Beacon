import { apiService } from '@/api/apiService';
import type { ProcessedKeyword, ProcessedScope } from '@/interfaces/initiation';
import { FeasibilityStatus } from '@/interfaces/core';
import type { ReflectionLogEntry } from '@/interfaces/workflow';
import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import { computed, ref } from 'vue';

import type {
  BaseChatMessage
} from '@/interfaces/core';

export const useInitiativeStore = defineStore('intiation', () => {
    // --- State (Refs) ---

    /** The list of all chat messages in the initiation stage. */
    const chatMessages = ref<BaseChatMessage[]>([]);

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
        } as BaseChatMessage); // Type assertion for strict compliance
        chatMessages.value.push({
          id: uuidv4(),
          role: 'system',
          content: 'Agent is typing...',
          name: agentName,
          timestamp: new Date().toISOString(),
          sequenceNumber: chatMessages.value.length + 2,
        } as BaseChatMessage);
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
            entryType: log.entry_type,
            step: 'TOPIC_DEFINITION_LOCKIN',
            associatedResourceIds: [],
            associatedConceptIds: [],
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
        topicKeywords.value = response.data.map((keyword) => {
          return {
            id: keyword.id,
            label: keyword.text,
            workflowState: keyword.status,
            createdAt: keyword.created_at,
            updatedAt: keyword.updated_at
          }
        });
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
        topicScope.value = response.data.map((scope) => {
          return {
            id: scope.id,
            label: scope.label,
            rationale: scope.value,
            boundaryType: 'INCLUSION',
            workflowState: scope.status,
            createdAt: scope.created_at,
            updatedAt: scope.updated_at,
          }
        });
      }
    }

    async function getMessages() {
      let response = await apiService.workflows.initiation.getChatHistory();
      if (response.data) {
        chatMessages.value = response.data.map(message => {
          return {
            ...message,
            sequenceNumber: message.sequence_number
          }
        });
      }
    }

    async function getRefinedTopic() {
      let response = await apiService.workflows.initiation.getRefinedTopic();
      if (response.data) {
        feasibilityStatus.value = response.data.feasibility_status;
        finalQuestion.value = response.data.final_research_question;
        resourceSuggestion.value = response.data.resource_suggestion;
        stabilityScore.value = response.data.stability_score;
        topicKeywords.value = response.data.keywords.map(keyword => {
          return {
            id: keyword.id,
            label: keyword.text,
            workflowState: keyword.status,
            createdAt: keyword.created_at,
            updatedAt: keyword.updated_at
          }
        });
        topicScope.value = response.data.scope.map(scope => {
          return {
            id: scope.id,
            label: scope.label,
            rationale: scope.value,
            boundaryType: 'INCLUSION',
            workflowState: scope.status,
            createdAt: scope.created_at,
            updatedAt: scope.updated_at,
          }
        });
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
            entryType: log.entry_type,
            step: 'TOPIC_DEFINITION_LOCKIN',
            associatedResourceIds: [],
            associatedConceptIds: [],
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
