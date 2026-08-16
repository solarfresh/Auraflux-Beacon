import type { ModelProvider } from '@auraflux/design-system/interfaces/agents';
import type { ID } from '@auraflux/design-system/interfaces/core';
import { ref } from 'vue';

export interface ModelProviderManagerOptions {
  serverScope?: ID;
}

export function useModelProviderManager(options: ModelProviderManagerOptions) {
  const providers = ref<ModelProvider[]>([]);
  const selectedProvider = ref<ModelProvider | null>(null);
  const isModalOpen = ref(false);
  const isNew = ref(true);
  const isLoading = ref(false);

  const fetchAll = async () => {
    isLoading.value = true;
    try {
      // providers.value = await options.fetchProviders(options.serverScope);
    } finally {
      isLoading.value = false;
    }
  };

  const openCreateModal = () => {
    selectedProvider.value = null;
    isNew.value = true;
    isModalOpen.value = true;
  };

  const openEditModal = (providerId: string) => {
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

  const handleSave = async (providerData: ModelProvider) => {
    isLoading.value = true;
    try {
      // const saved = await options.saveProvider(providerData, options.serverScope);

      // if (isNew.value) {
      //   providers.value.push(saved);
      // } else {
      //   const index = providers.value.findIndex((p) => p.id === saved.id);
      //   if (index !== -1) providers.value[index] = saved;
      // }
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