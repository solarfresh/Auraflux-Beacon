import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiService } from '@/api/apiService'; // Reuse your API service

// Assuming types are defined elsewhere
import type { ScopeData, SearchResult, WorkflowStep } from '@/interfaces/search';

export const useWorkflowStore = defineStore('workflow', () => {
    // --- State ---
    const searchQuery = ref<string>('');
    const searchResults = ref<SearchResult[]>([]);

    const currentStep = ref<WorkflowStep>('SEARCH');
    const scopeData = ref<ScopeData | null>(null);
    const analysisData = ref<object | null>(null);
    const updatedAt = ref<string>('')
    const isLoading = ref<boolean>(false);

    // --- Actions ---

    /**
     * Fetches the persisted workflow state from the backend.
     * Called on application/view mount.
     */
    async function fetchStateFromBackend() {
        // This action uses the GET /api/fetch-state endpoint (your initial task)
        try {
            const response = await apiService.workflows.fetchState.get();

            currentStep.value = response.data.current_step || 'SEARCH';
            scopeData.value = response.data.scope_data || null;
            analysisData.value = response.data.analysis_data || null;
            searchQuery.value = response.data.query || ''
            searchResults.value = response.data.knowledge_sources || []
            updatedAt.value = response.data.updated_at || ''

        } catch (error) {
            console.error('Failed to load workflow state:', error);
            // Default to initial state on failure
            currentStep.value = 'SEARCH';
        }
    }

    /**
     * Executes the search and updates results.
     */
    async function performSearch(query: string) {
        if (currentStep.value !== 'SEARCH') return;

        searchQuery.value = query;
        isLoading.value = true;

        try {
            const searchResponse = await apiService.search.results.create(query);
            searchResults.value = searchResponse.data;
        } catch (error) {
            console.error('Search failed:', error);
            searchResults.value = [];
        } finally {
            isLoading.value = false;
        }
    }

    /**
     * Locks the search results and transitions the step to SCOPE.
     * Uses the POST utility we defined earlier (update_workflow_state).
     */
    async function lockData() {
        if (searchResults.value.length === 0 || currentStep.value !== 'SEARCH') return;

        // Persist the current state and step transition to the backend, and update local state
        let response = await apiService.workflows.lockData.create(searchQuery.value);

        // Update local state
        currentStep.value = response.data['new_step'];
        console.log("Data Locked. Transitioning to Step 2.");
    }

    /**
     * Defines the scope and transitions the step to COLLECTION.
     */
    async function defineScope(data: ScopeData) {
        if (currentStep.value !== 'SCOPE') return;

        // 1. Persist the scope data and step transition to the backend
        // await apiService.workflow.defineScope(data);

        // 2. Update local state
        scopeData.value = data;
        currentStep.value = 'COLLECTION';
    }

    return {
        currentStep,
        searchQuery,
        searchResults,
        scopeData,
        isLoading,
        fetchStateFromBackend,
        performSearch,
        lockData,
        defineScope,
    };
});