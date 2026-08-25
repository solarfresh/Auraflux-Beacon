import type { ModelProvider, ModelProviderForm } from '@auraflux/design-system/interfaces/agents';
import type { ID } from '@auraflux/design-system/interfaces/core';
import { apiService } from '@auraflux/shared-core/api/apiService';
import { ref } from 'vue';

export interface ModelProviderManagerOptions {
  serverScope?: ID;
}

export function useModelProviderManager() {
  const providers = ref<ModelProvider[]>([]);
  const selectedProvider = ref<ModelProvider | null>(null);
  const isModalOpen = ref(false);
  const isNew = ref(true);
  const isLoading = ref(false);

  const fetchAll = async () => {
    isLoading.value = true;
    try {
      const response  = await apiService.auth.agents.models.get();
      if (response.data) {
        providers.value = response.data;
      } else {
        console.warn('No data received from the API when fetching model providers.');
      }
    } finally {
      isLoading.value = false;
    }
  };

  const openCreateModal = () => {
    selectedProvider.value = null;
    isNew.value = true;
    isModalOpen.value = true;
  };

  const openEditModal = (providerId: ID) => {
    const target = providers.value.find((p) => p.id === providerId);
    if (target) {
      selectedProvider.value = { ...target };
      isNew.value = false;
      isModalOpen.value = true;
    }
  };

  const closeModal = () => {
    isModalOpen.value = false;
    selectedProvider.value = null;
  };

  const handleSave = async (providerData: ModelProviderForm) => {
    isLoading.value = true;
    try {
      const payload = {
        ...providerData,
      }
      const response = await apiService.auth.agents.models.create(payload);
      if (response.data) {
        if (isNew.value) {
          providers.value.push(response.data);
        } else {
          const index = providers.value.findIndex((p) => p.id === response.data.id);
          if (index !== -1) providers.value[index] = response.data;
        }
      } else {
        console.warn('No data received from the API when saving model provider.');
      }

      closeModal();
    } finally {
      isLoading.value = false;
    }
  };

  return {
    providers,
    selectedProvider,
    isModalOpen,
    isNew,
    isLoading,
    fetchAll,
    openCreateModal,
    openEditModal,
    closeModal,
    handleSave,
  };
}