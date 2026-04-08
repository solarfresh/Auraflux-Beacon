<template>
  <VBox tag="main" class="w-full min-h-screen bg-slate-50">
    <VBox class="max-w-7xl mx-auto w-full px-6 py-8">
      <VStack gap="lg">

        <VBox
          background="white"
          padding="md"
          rounded="lg"
          class="border border-slate-200/60 shadow-sm flex justify-between items-center"
        >
          <VModelProviderToolbar
            v-model="toolbarState"
            @create="isProviderModalOpen = true"
          />
        </VBox>

        <VBox v-if="hasProviders" class="w-full">
          <VGrid cols="1 sm:2 lg:3" gap="lg">
            <VInteractivePlaceholder
              label="Connect New Engine"
              icon-name="CpuChip"
              class="h-full"
              @click="isProviderModalOpen = true"
            />

            <VModelProviderCard
              v-for="provider in providers"
              :key="provider.id"
              :provider="provider"
              @edit="openProviderEditor(provider)"
              @test="testConnection(provider.id)"
            />
          </VGrid>
        </VBox>

        <VEmptyState
          v-else
          title="No providers configured"
          description="Auraflux needs at least one model provider (like Gemini or OpenAI) to power your agents."
          icon="CpuChip"
        />

      </VStack>
    </VBox>

    <FullScreenModalTemplate
      :is-open="isProviderModalOpen"
      max-width-class="max-w-2xl"
      @close="closeDrawer"
    >
      <template #header>
        {{ selectedProvider ? 'Edit Model Provider' : 'Connect New Engine' }}
      </template>

      <template #content>
        <ModelProviderEditor
          :initial-data="selectedProvider"
          @close="closeDrawer"
          @save="handleSaveProvider"
        />
      </template>
    </FullScreenModalTemplate>
  </VBox>
</template>

<script setup lang="ts">
import VBox from '@/components/atoms/layout/VBox.vue';
import VGrid from '@/components/atoms/layout/VGrid.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VEmptyState from '@/components/molecules/feedback/VEmptyState.vue';
import VInteractivePlaceholder from '@/components/molecules/resources/VInteractivePlaceholder.vue';
import VModelProviderCard from '@/components/molecules/resources/VModelProviderCard.vue';
import VModelProviderToolbar from '@/components/molecules/resources/VModelProviderToolbar.vue';
import ModelProviderEditor from '@/components/organisms/forms/ModelProviderEditor.vue';
import FullScreenModalTemplate from '@/components/templates/FullScreenModalTemplate.vue';
import { ModelProvider } from '@/interfaces/agents';
import type { ModelProviderSelectorState } from '@/interfaces/indicators';
import { useAgentStore } from '@/stores/agent';
import { computed, onMounted, ref } from 'vue';

const agentStore = useAgentStore();
const isProviderModalOpen = ref(false);
const selectedProvider = ref(null);
const toolbarState = ref<ModelProviderSelectorState>({
  filter: 'ALL',
  providerType: 'ALL',
  sorter: 'NAME'
});

const providers = computed(() => [...agentStore.providers.values()]);
const hasProviders = computed(() => providers.value.length > 0);

onMounted(() => {
  agentStore.loadProviders();
});

const handleSaveProvider = async (provider: ModelProvider) => {
  await agentStore.createModelProvider(provider);
  isProviderModalOpen.value = false;
};

const openProviderEditor = (provider: any) => {
  selectedProvider.value = provider;
  isProviderModalOpen.value = true;
};

const closeDrawer = () => {
  isProviderModalOpen.value = false;
  selectedProvider.value = null;
};

const testConnection = async (id: string) => {
  await agentStore.verifyProvider(id);
};
</script>