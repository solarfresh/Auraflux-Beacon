import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiService } from '@/api/apiService';

import type { ISPStep, ChatMessage, ReflectionLog } from '@/interfaces/search';

// --- Map for Next Step Logic (Used in transitionToNextPhase) ---
const ISP_TRANSITIONS: Record<ISPStep, ISPStep> = {
    'INITIATION': 'SELECTION',
    'SELECTION': 'EXPLORATION',
    'EXPLORATION': 'FORMULATION',
    'FORMULATION': 'COLLECTION',
    'COLLECTION': 'PRESENTATION',
    'PRESENTATION': 'PRESENTATION', // End state
};

export const useWorkflowStore = defineStore('workflow', () => {
    // --- State ---
    const currentStep = ref<ISPStep>('INITIATION');
    const chatMessages = ref<ChatMessage[]>([]);
    const reflectionLogs = ref<ReflectionLog[]>([]);
    const isLoading = ref<boolean>(false);

    // --- Getters ---
    const isStepInitiation = computed(() => currentStep.value === 'INITIATION');
    const isStepSelection = computed(() => currentStep.value === 'SELECTION');

    // --- Actions ---

    /**
     * Fetches the persisted workflow state from the backend.
     */
    async function fetchStateFromBackend() {
        isLoading.value = true;
        try {
            const response = await apiService.workflows.fetchState.get();

            currentStep.value = response.data.current_step || 'INITIATION';
            chatMessages.value = response.data.chat_history || [];
            reflectionLogs.value = response.data.reflection_logs || [];
        } catch (error) {
            console.error('Failed to load workflow state:', error);
            currentStep.value = 'INITIATION';
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Executes the search and updates results (Should only run in INITIALIZATION step).
     * This is typically the first large-scale action.
     */
    async function performSearch(query: string) {
        if (currentStep.value !== 'INITIATION') return;
        // ... (Search logic remains the same)
        // Note: In a real ISP flow, search might happen in Exploration too,
        // but here we keep it locked to the initial phase for structure.
        // ...
    }

    /**
     * Adds a new message to the chat history and persists it.
     * @param message The new message object.
     */
    async function addMessage(message: ChatMessage) {
        chatMessages.value.push(message);

        // 1. Persist the new message to the backend
        // await apiService.workflows.addChatMessage.create(message);

        // 2. Mock Agent Response (In a real app, this would be an API call to the agent)
        if (message.type === 'user') {
            // Simulate waiting for API response
            setTimeout(() => {
                 const agentResponse: ChatMessage = {
                    id: Date.now() + 1,
                    type: 'agent',
                    content: `Thanks for your input: "${message.content.substring(0, 50)}...". I've updated the structured output based on this.`
                };
                chatMessages.value.push(agentResponse);
            }, 500);
        }
    }

    /**
     * Logs a reflection entry and persists it.
     */
    async function logReflection(thought: string, category: string) {
        const newLog: ReflectionLog = {
            thought,
            category,
            timestamp: Date.now(),
        };
        reflectionLogs.value.push(newLog);

        // 1. Persist the log entry to the backend
        // await apiService.workflows.logReflection.create(newLog);
    }

    /**
     * Transitions the workflow to the next major ISP phase.
     * This requires certain criteria (e.g., final question) to be met.
     */
    async function transitionToNextPhase() {
        const nextStep = ISP_TRANSITIONS[currentStep.value];
        if (!nextStep) {
            console.warn('Attempted to transition from an unknown or final step.');
            return;
        }

        // 1. Persist the state and step transition to the backend
        // This single API call handles saving all current structured data (keywords, scope, question)
        // await apiService.workflows.transitionPhase.create({ nextStep });

        // 2. Update local state
        currentStep.value = nextStep;
        console.log(`Phase Transitioned from ${currentStep.value} to ${nextStep}`);
    }

    // --- REMOVED ACTIONS ---
    // lockData 和 defineScope 的核心職能現在應包含在 transitionToNextPhase 的 API 呼叫中，
    // 或在專門的 action 中更新單一結構化數據（例如 updateScopeData）。

    return {
        // State
        currentStep,
        chatMessages,
        reflectionLogs,
        isLoading,

        // Getters
        isStepInitiation,
        isStepSelection,

        // Actions
        fetchStateFromBackend,
        performSearch,
        addMessage,
        logReflection,
        transitionToNextPhase,
    };
});