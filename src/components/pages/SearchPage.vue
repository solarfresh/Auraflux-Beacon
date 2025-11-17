<template>
  <StrategyCanvasTemplate
    :current-step="workflowStore.currentStep"
    :search-query="workflowStore.searchQuery"
    :search-results="workflowStore.searchResults"
    :scope-data="workflowStore.scopeData"
    :is-loading="workflowStore.isLoading"
    :is-logged-in="authStore.isLoggedIn"

    @search="workflowStore.performSearch"
    @lock-data="workflowStore.lockData"
    @scope-defined="workflowStore.defineScope"

    />
</template>

<script setup lang="ts">
import StrategyCanvasTemplate from '@/components/templates/StrategyCanvasTemplate.vue';
import { useWorkflowStore } from '@/stores/workflow';
import { useAuthStore } from '@/stores/auth';
import { onMounted } from 'vue';

// --- Store Management ---
const workflowStore = useWorkflowStore();
const authStore = useAuthStore();

// --- Initial Data Load ---
// Although App.vue calls checkAuthStatus(), we ensure the workflow state is loaded here.
onMounted(() => {
    // This is crucial: Fetch the persistent state from the backend store upon mounting the view.
    workflowStore.fetchStateFromBackend();
});

/* * The following local state and logic are REMOVED because they are now managed by the store:
 * * const searchQuery = ref<string>('');
 * const searchResults = ref<SearchResult[]>([]);
 * const isLoading = ref<boolean>(false);
 * const currentStep = ref<WorkflowStep>('SEARCH');
 * const handleSearch = async (query: string) => { ... };
 * const handleLockData = () => { ... };
 * * The data flow is now:
 * Template Emits Action (@lock-data) -> View Calls Store Action (workflowStore.lockData()) -> Store Mutates State -> Template Re-renders
 */
</script>