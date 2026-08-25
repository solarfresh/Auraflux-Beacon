<template>
  <VBox tag="main" class="w-full min-h-screen">
    <VBox intent="neutral" surface="base" class="max-w-7xl mx-auto w-full">
      <VStack gap="lg">
        <!-- Header / Toolbar Shell -->
        <VBox
          padding="none"
          rounded="lg"
          class="shadow-sm"
        >
          <VModelProviderToolbar
            :title="title"
            :description="description"
            @create="$emit('create')"
          />
        </VBox>

        <!-- Grid Area with Interactive Placeholder and Provider Cards -->
        <VBox v-if="hasProviders" class="max-w-7xl mx-auto w-full px-6">
          <VGrid cols="1 sm:2 lg:3 xl:4" gap="lg">
            <VInteractivePlaceholder
              intent="neutral"
              surface="soft"
              border="dashed"
              label="Add Model Provider"
              icon-name="Plus"
              class="h-48"
              @click="$emit('create')"
            />
            <VModelProviderCard
              v-for="provider in providers"
              :key="provider.id"
              :provider="provider"
              @click="$emit('select-provider', provider.id)"
            />
          </VGrid>
        </VBox>

        <!-- Empty State View -->
        <VBox
          v-else
          class="max-w-7xl mx-auto w-full px-6 pt-16"
        >
          <VEmptyState
            title="No model providers configured"
            description="Use the button above to set up your first LLM API credential or endpoint."
            icon="ServerStack"
          />
        </VBox>
      </VStack>
    </VBox>
  </VBox>

  <!-- Provider Settings Modal Container -->
  <VBox tag="main" class="w-full min-h-screen bg-slate-50">
    <ModelProviderModal
      :is-open="isModalOpen"
      :provider="selectedProvider"
      :is-new="isNew"
      @cancel="$emit('close-modal')"
      @confirm="(provider) => $emit('save-provider', provider)"
    />
  </VBox>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// Layout & Business Components
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VGrid from '@auraflux/design-system/components/atoms/layout/VGrid.vue';
import VModelProviderToolbar from '@auraflux/design-system/components/organisms/navs/VModelProviderToolbar.vue';
import VModelProviderCard from '@auraflux/design-system/components/organisms/resources/VModelProviderCard.vue';
import VInteractivePlaceholder from '@auraflux/design-system/components/molecules/resources/VInteractivePlaceholder.vue';
import VEmptyState from '@auraflux/design-system/components/molecules/indicators/VEmptyState.vue';
import ModelProviderModal from '@auraflux/design-system/components/organisms/modals/ModelProviderModal.vue';

import type { ID } from '@auraflux/design-system/interfaces/core';
import type { ModelProvider } from '@auraflux/design-system/interfaces/agents';

export interface ModelProviderManagementViewProps {
  providers: ModelProvider[];
  selectedProvider?: ModelProvider | null;
  isModalOpen?: boolean;
  isNew?: boolean;
  title?: string;
  description?: string;
}

const props = withDefaults(defineProps<ModelProviderManagementViewProps>(), {
  selectedProvider: null,
  isModalOpen: false,
  isNew: true,
  title: 'Model Providers',
  description: 'Configure LLM API credentials, endpoints, and monitor operational health.',
});

defineEmits<{
  (e: 'create'): void;
  (e: 'select-provider', providerId: ID): void;
  (e: 'close-modal'): void;
  (e: 'save-provider', provider: ModelProvider): void;
}>();

const hasProviders = computed(() => props.providers.length > 0);
</script>