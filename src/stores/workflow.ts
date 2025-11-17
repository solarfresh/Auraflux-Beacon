import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { apiService } from '@/api/apiService'; // Reuse your API service

// Assuming types are defined elsewhere
import type { ScopeData, SearchResult, WorkflowStep } from '@/interfaces/search';

export const useWorkflowStore = defineStore('workflow', () => {
    // --- State ---
    const currentStep = ref<WorkflowStep>('SEARCH');
    const searchQuery = ref<string>('');
    const searchResults = ref<SearchResult[]>([]);
    const scopeData = ref<ScopeData | null>(null);
    const isLoading = ref<boolean>(false);

    // --- Actions ---

    /**
     * Fetches the persisted workflow state from the backend.
     * Called on application/view mount.
     */
    async function fetchStateFromBackend() {
        // This action uses the GET /api/fetch-state endpoint (your initial task)
        try {
            // const response = await apiService.workflow.getState(); // Assuming apiService handles the endpoint

            // // Assuming response contains the full state object from the backend
            // currentStep.value = response.data.current_step || 'SEARCH';
            // searchQuery.value = response.data.search_query || '';
            // searchResults.value = response.data.search_results || [];
            // scopeData.value = response.data.scope_data || null;

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

        // 1. Persist the current state and step transition to the backend
        // await apiService.workflow.lockData({
        //     search_query: searchQuery.value,
        //     search_results: searchResults.value,
        // });

        // 2. Update local state
        currentStep.value = 'SCOPE';
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