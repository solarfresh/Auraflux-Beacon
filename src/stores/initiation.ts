import { apiService } from '@/api/apiService';
import { FeasibilityStatus } from '@/interfaces/core';
import type { ReflectionLogEntry } from '@/interfaces/project';
import type { RefinedTopic } from '@/interfaces/initiation';
import type { ProcessedKeyword, ProcessedScope } from '@/interfaces/initiation';
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
  async function addMessage(messageContent: string, agentName: string) {
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
  }

  async function createOrUpdateReflection(logId: string, title: string, content: string, status: string) {
    let response = null;
    if (logId.includes('new')) {
      response = await apiService.projects.base.createReflectionLog(title, content, status);
    } else {
      response = await apiService.projects.base.updateReflectionLogById(logId, title, content, status);
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
      response = await apiService.projects.keywords.create(text, status);
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
      response = await apiService.projects.scopes.create(label, value, status);
    }

    if (response.data) {
      topicScope.value = response.data;
    }
  }

  async function setMessages(messages: ChatMessage[]) {
    chatMessages.value = messages;
  }

  async function setRefinedTopic(refinedTopic: RefinedTopic) {
    feasibilityStatus.value = refinedTopic.feasibilityStatus;
    finalQuestion.value = refinedTopic.finalQuestion;
    resourceSuggestion.value = refinedTopic.resourceSuggestion || '';
    stabilityScore.value = refinedTopic.stabilityScore;
    topicKeywords.value = refinedTopic.keywords || [];
    topicScope.value = refinedTopic.scope;
  }

  async function setReflection(logs: ReflectionLogEntry[]) {
    reflectionLogs.value = logs;
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
    setMessages,
    setRefinedTopic,
    setReflection,
  };
})
