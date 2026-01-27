<template>
  <BaseSidebarLayout
    title="Intelligence Hub"
    class="w-[384px] h-full border-l border-slate-100 shadow-xl"
  >

    <template #body>
      <VNavTabs
        class="h-full"
        v-model="activeTabId"
        :tabs="navigationTabs"
      >
        <template #tab-collaboration-content>
          <VBox background="slate-50" class="h-full">
            <VStack gap="none" full-height scrollable>
              <ChatInterface
                :messages="chatMessages"
                :is-typing="isAiProcessing"
                @send-message="handleAiCommand"
              >
<!--
                <template #header>
                  <VStatusCard
                    variant="warning"
                    icon-name="Sparkles"
                    title="Strategic Context"
                    class="m-4"
                  >
                    <VTypography size="xs">
                      AI is mapping dependencies for <strong>Project Alpha</strong>.
                    </VTypography>
                  </VStatusCard>
                </template>
 -->
              </ChatInterface>
            </VStack>
          </VBox>
        </template>

        <template #tab-discovery-content>
          <VBox background="slate-50" class="h-full">
            <VStack gap="none">
              <VBox background="white" padding="md" border="bottom">
                <VFormField label="Source Discovery">
                  <VInputGroup
                    v-model="searchQuery"
                    placeholder="Search strategic assets..."
                    @search="handleSearch"
                  />
                </VFormField>
              </VBox>

              <VBox padding="xs" class="overflow-y-auto">
                <VStack gap="sm">
                  <VNavGroup title="Search Results" :count="resources.length">
                    <template #content>
                      <VStack gap="xs">
                        <VMetaListItem
                          v-for="res in resources"
                          :key="res.id"
                          :resource="res"
                        />
                      </VStack>
                    </template>
                  </VNavGroup>

                  <VEmptyState
                    v-if="resources.length === 0"
                    icon="MagnifyingGlass"
                    title="No resources found"
                  />
                </VStack>
              </VBox>
            </VStack>
          </VBox>
        </template>
      </VNavTabs>
    </template>
  </BaseSidebarLayout>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import type { ChatMessage } from '@/interfaces/core';
import type { ResourceItem } from '@/interfaces/knowledge';

// --- Atomic & Molecular Imports ---
import BaseSidebarLayout from '@/components/organisms/layout/BaseSidebarLayout.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';

import VNavTabs from '@/components/molecules/navs/VNavTabs.vue';
import VNavGroup from '@/components/molecules/navs/VNavGroup.vue';
import VMetaListItem from '@/components/molecules/navs/VMetaListItem.vue';
import VEntityChip from '@/components/molecules/indicators/VEntityChip.vue';
import VStatusCard from '@/components/molecules/indicators/VStatusCard.vue';
import VEmptyState from '@/components/molecules/indicators/VEmptyState.vue';
import VFormField from '@/components/molecules/forms/VFormField.vue';
import VInputGroup from '@/components/molecules/forms/VInputGroup.vue';

import ChatInterface from '@/components/organisms/chat/ChatInterface.vue';

// --- State Management ---
const activeTabId = ref('collaboration');
const searchQuery = ref('');
const isAiProcessing = ref(false);

const navigationTabs = [
  { id: 'collaboration', label: 'Collaboration' },
  { id: 'discovery', label: 'Discovery' }
];

const resources = reactive<ResourceItem[]>([
  { id: "1", label: 'Market Trends 2026', description: 'Emerging tech analysis...', format: 'URL', sourceType: 'MANUAL', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), keywords: [] },
  { id: "2", label: 'Competitor Matrix', description: 'Feature set comparison...', format: 'URL', sourceType: 'MANUAL', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), keywords: [] }
]);

const chatMessages = reactive<ChatMessage[]>([
  { id: '1', role: 'system', content: 'Ready to synthesize your findings.', timestamp: new Date().toISOString(), sequenceNumber: 1 }
]);

const handleAiCommand = (content: string) => {
  // chatMessages.push({ id: Date.now().toString(), role: 'user', content });
  // isAiProcessing.value = true;
  // setTimeout(() => { isAiProcessing.value = false; }, 1500);
};

const handleSearch = () => { /* API Logic */ };
</script>