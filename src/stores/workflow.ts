import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type {
    ISPStep,
} from '@/interfaces/workflow';

// --- Store Definition ---

export const useWorkflowStore = defineStore('workflow', () => {

    // --- State (Refs) ---

    /** The current stage of the Information Search Process (ISP). */
    const currentStep = ref<ISPStep>('INITIATION');

    // --- Getters (Computed) ---

    /** Checks if the current step allows the Export Report feature. */
    // const isExportAvailable = computed(() => {
    //     return currentStep.value === 'COLLECTION' || currentStep.value === 'PRESENTATION';
    // });


    // --- Actions (Functions) ---


    // --- Return public API ---
    return {
        currentStep,
        // Getters
        // isQuestionFinalized,
        // isExportAvailable,

        // Actions
    };
});