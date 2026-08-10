import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export const useLoginStore = defineStore('loginModal', () => {
  // --- State ---

  /**
   * Tracks whether the Login Modal is currently visible (open) or hidden (closed).
   */
  const isOpen = ref(false);

  // --- Getters (Computed Properties) ---

  /**
   * Getter for the modal's open state.
   */
  const isModalOpen = computed(() => isOpen.value);

  // --- Actions (Methods) ---

  /**
   * Opens the Login Modal.
   */
  function openModal() {
    isOpen.value = true;
    console.log('Login Modal opened.');
  }

  /**
   * Closes the Login Modal.
   */
  function closeModal() {
    isOpen.value = false;
    console.log('Login Modal closed.');
  }

  // --- Return the public interface ---
  return {
    isOpen,
    isModalOpen,
    openModal,
    closeModal,
  };
});