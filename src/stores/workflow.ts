import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

// --- Import Interfaces from 'interface/workflow.ts' ---
// Assuming these types are imported from a central interface file
import type {
    ISPStep,
    ChatMessage,
    Keyword,
    ReflectionLog,
    ScopeItem
} from '@/interfaces/workflow';
// NOTE: For practical use, replace '@/interfaces/workflow' with the actual path
// and ensure the interfaces file is available.

// --- Store Definition ---

export const useWorkflowStore = defineStore('workflow', () => {

    // --- State (Refs) ---

    /** The current stage of the Information Search Process (ISP). */
    const currentStep = ref<ISPStep>('INITIATION');

    /** Flag to indicate if any long-running operation is in progress (for UI loading spinners). */
    const isLoading = ref(false);

    /** The list of all chat messages in the current workflow. */
    const chatMessages = ref<ChatMessage[]>([]);

    /** The drafted or finalized core research question. This is the main output of the INITIATION phase. */
    const searchQuery = ref<string>('');

    /** Structured output data for core keywords. */
    const keywords = ref<Keyword[]>([]);

    /** Structured output data for the research scope (e.g., Geographical, Timeframe). */
    const scope = ref<ScopeItem[]>([]);

    /** Log of all user reflections (thoughts, anxieties, hunches). */
    const reflectionLogs = ref<ReflectionLog[]>([]);


    // --- Getters (Computed) ---

    /** Checks if the final research question has been set. */
    const isQuestionFinalized = computed(() => !!searchQuery.value); // Simple check for existence

    /** Checks if the current step allows the Export Report feature. */
    const isExportAvailable = computed(() => {
        return currentStep.value === 'COLLECTION' || currentStep.value === 'PRESENTATION';
    });


    // --- Actions (Functions) ---

    /**
     * Adds a new message to the chat history.
     */
    function addMessage(message: Omit<ChatMessage, 'id' | 'timestamp'> & { id?: number }) {
        chatMessages.value.push({
            id: message.id || Date.now(), // Use provided ID or generate one
            type: message.type,
            content: message.content,
            // Assuming ChatMessage interface in workflow.ts doesn't require timestamp,
            // but we add it for internal consistency if needed later.
            // timestamp: Date.now(),
        } as ChatMessage); // Type assertion for strict compliance
    }

    /**
     * Simulates fetching workflow state from a backend (e.g., initial load or recovery).
     */
    async function fetchStateFromBackend() {
        isLoading.value = true;
        try {
            await new Promise(resolve => setTimeout(resolve, 500));

            // Mock loaded data:
            currentStep.value = 'INITIATION';
            searchQuery.value = 'How does blockchain technology solve data privacy issues in healthcare?';

            chatMessages.value = [
                { id: 1, type: 'agent', content: "Welcome! I'm the Clarifier Agent. Tell me about the general topic you want to explore. Don't worry about being precise yet!" },
                { id: 2, type: 'user', content: "I want to research Sustainable Fashion, maybe focusing on labor issues." },
                { id: 3, type: 'agent', content: "Got it. To refine this, The Validator Agent suggests focusing on a specific **Scope (e.g., Southeast Asia)** or a **Mechanism (e.g., Auditing Standards)**. Which one interests you more?" },
            ]

            keywords.value = [
                { text: 'Blockchain-EHR', status: 'Locked', source: 'Concept Agent' },
                { text: 'GDPR Compliance', status: 'Draft', source: 'Validator Agent' },
            ];

            scope.value = [
                { label: 'Geographical Scope', value: 'Europe (EU)', status: 'Locked' },
                { label: 'Time Frame', value: '2020 - Present', status: 'Draft' },
            ];

        } catch (error) {
            console.error('Failed to load workflow state:', error);
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Action triggered by ActionBar: Locks the current data and persists it.
     */
    async function lockData() {
        // In the final design, the ActionBar button controls the loading state primarily,
        // but we ensure it is set here just in case.
        if (!isLoading.value) isLoading.value = true;

        try {
            // Mock API call to lock and persist the structured output
            await new Promise(resolve => setTimeout(resolve, 800));
            console.log(`[Store Action] Data Locked: ${searchQuery.value}`);

        } catch (error) {
            console.error('Failed to lock data:', error);
            throw error;
        }
    }

    /**
     * Action triggered by ActionBar: Transitions the workflow to the next step.
     */
    async function transitionToNextPhase() {
        const phaseOrder: ISPStep[] = [
            'INITIATION',
            'SELECTION',
            'EXPLORATION',
            'FORMULATION',
            'COLLECTION',
            'PRESENTATION'
        ];

        const currentIndex = phaseOrder.indexOf(currentStep.value);
        if (currentIndex < 0 || currentIndex >= phaseOrder.length - 1) {
            console.warn('Cannot transition: Already at the final stage or step unknown.');
            return;
        }

        const nextStep = phaseOrder[currentIndex + 1];

        // Mock API call to confirm phase change on the backend
        await new Promise(resolve => setTimeout(resolve, 500));

        // Update local state
        currentStep.value = nextStep;
        console.log(`[Store Action] Transitioned to: ${nextStep}`);
    }

    /**
     * Logs a thought/feeling during the reflection process.
     */
    function logReflection(thought: string, category: string) {
        const newLog: ReflectionLog = {
            thought,
            category,
            timestamp: Date.now(),
        };
        reflectionLogs.value.push(newLog);

        console.log(`Reflection Logged: Category: ${category}`);
        // Optional: Send a system message to the chat
        addMessage({
            id: Date.now() + 1,
            type: 'agent',
            content: `Reflection logged under category "${category}".`,
        });
    }

    /**
     * Action to handle keyword updates (e.g., manual locking/editing from sidebar).
     */
    function updateKeyword(payload: { index: number, newText: string, newStatus: 'Locked' | 'Draft' }) {
        if (payload.index >= 0 && payload.index < keywords.value.length) {
            keywords.value[payload.index].text = payload.newText;
            keywords.value[payload.index].status = payload.newStatus;
            console.log(`[Store Action] Updated keyword ${payload.index}: ${payload.newText}`);
        }
    }


    // --- Return public API ---
    return {
        // State
        currentStep,
        isLoading,
        chatMessages,
        searchQuery,
        keywords,
        scope,
        reflectionLogs,

        // Getters
        isQuestionFinalized,
        isExportAvailable,

        // Actions
        addMessage,
        fetchStateFromBackend,
        lockData,
        transitionToNextPhase,
        logReflection,
        updateKeyword,
    };
});