<template>
  <!-- Presenter View (Pure UI Layer) -->
  <ModelProviderManagementView
    :providers="manager.providers.value"
    :selected-provider="manager.selectedProvider.value"
    :is-modal-open="manager.isModalOpen.value"
    :is-new="manager.isNew.value"
    :title="title"
    :description="description"
    @create="manager.openCreateModal"
    @select-provider="manager.openEditModal"
    @close-modal="manager.closeModal"
    @save-provider="manager.handleSave"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import config from '@auraflux/shared-core/config';

// Views & Composables
import ModelProviderManagementView from '@auraflux/design-system/components/views/ModelProviderManagementView.vue';
import { useModelProviderManager } from '@auraflux/shared-core/composables/useModelProviderManager';

const title = ref<string>('Model Providers');
const description = ref<string>('Configure LLM API credentials, endpoints, and monitor operational health.');

// Initialize Composable with injected API Adapter
const manager = useModelProviderManager();

// Fetch provider list on component mount
onMounted(() => {
  manager.fetchAll();
});
</script>