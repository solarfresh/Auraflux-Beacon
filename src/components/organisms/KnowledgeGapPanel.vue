<template>
  <div
    :class="[
      'fixed right-4 bottom-4 z-50 transition-all duration-300',
      { 'w-96 shadow-2xl rounded-xl bg-white border border-blue-200': isExpanded },
      { 'p-2 rounded-full shadow-lg bg-blue-600': !isExpanded }
    ]"
  >
    <div
      v-if="!isExpanded"
      class="p-3 cursor-pointer relative"
      @click="togglePanel"
    >
      <Icon name="magnifying-glass" type="solid" size="xl" color="white" />

      <span
        v-if="pendingRequestsCount > 0"
        class="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full animate-pulse"
      >
        {{ pendingRequestsCount }}
      </span>
    </div>

    <div v-else class="p-4">
      <div class="flex justify-between items-center mb-4">
        <Text tag="h3" size="lg" weight="bold" color="gray-800">
          Knowledge Gap Intervention ({{ pendingRequestsCount }} Pending)
        </Text>
        <Button variant="secondary" size="sm" @click="togglePanel" icon-only>
          <Icon name="xmark" type="solid" size="md" color="gray-700" />
        </Button>
      </div>

      <div v-if="pendingRequestsCount === 0" class="text-center p-6 text-gray-500">
        <Icon name="check-circle" type="solid" size="xl" color="green-500" class="mb-2" />
        <Text tag="p" size="sm" weight="medium">No Agents are currently requesting additional data.</Text>
      </div>

      <div v-else class="space-y-4 max-h-64 overflow-y-auto pr-2">
        <div v-for="(request, index) in pendingRequests" :key="index" class="p-3 border rounded-lg">
          <label class="flex items-start cursor-pointer">
            <input
              type="checkbox"
              :checked="request.selected"
              @change="toggleRequestSelection(index)"
              class="mt-1 mr-3 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <div>
              <Text tag="p" size="sm" weight="medium" color="gray-700">
                <span class="font-bold">{{ request.agentRole }}:</span> "{{ request.query }}"
              </Text>
              <Text tag="p" size="xs" color="gray-500" class="mt-1 italic">
                Reason: {{ request.reason }}
              </Text>
            </div>
          </label>
        </div>
      </div>

      <div v-if="pendingRequestsCount > 0" class="mt-4 pt-4 border-t border-gray-200 space-y-3">

        <Textarea
          v-model="mergedQuery"
          placeholder="Final merged search query..."
          rows="2"
          class="w-full"
        />

        <div class="flex justify-between space-x-2">
          <Button
            variant="secondary"
            size="sm"
            :disabled="!hasSelectedRequest"
            @click="mergeSelectedQueries"
          >
            <Icon name="layer-group" type="solid" size="sm" class="mr-1" />
            Merge Selected
          </Button>

          <Button
            variant="primary"
            size="sm"
            :disabled="!mergedQuery.trim()"
            @click="executeSupplementalSearch"
          >
            <Icon name="bolt" type="solid" size="sm" color="white" class="mr-1" />
            Execute Supplemental Search
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import Textarea from '@/components/atoms/Textarea.vue';
import type { KnowledgeGapRequest } from '@/interfaces/search';
import { computed, ref } from 'vue';

// --- State Management ---
const isExpanded = ref(false);
const mergedQuery = ref('');

// Mock Data for demonstration. In a real app, this would come from a global store.
const pendingRequests = ref<KnowledgeGapRequest[]>([
  {
    agentRole: 'Legal Agent',
    query: "quantify compliance cost for EU's AI Act on LLMs in Asia.",
    reason: 'The existing RAG data only provides legal summaries, not quantified financial risk.',
    selected: false,
  },
  {
    agentRole: 'CTO Agent',
    query: 'case studies of enterprise LLM deployment latency vs. cost.',
    reason: 'We need real-world latency metrics to balance the "Speed vs. Security" dichotomy.',
    selected: true, // Example: one is pre-selected
  },
]);

// --- Computed Properties ---

const pendingRequestsCount = computed(() => pendingRequests.value.length);
const hasSelectedRequest = computed(() => pendingRequests.value.some(req => req.selected));

// --- Methods ---

const togglePanel = () => {
  isExpanded.value = !isExpanded.value;
};

const toggleRequestSelection = (index: number) => {
  pendingRequests.value[index].selected = !pendingRequests.value[index].selected;
};

const mergeSelectedQueries = () => {
  const selectedQueries = pendingRequests.value
    .filter(req => req.selected)
    .map(req => req.query);

  if (selectedQueries.length > 0) {
    // Basic merging logic: join with " AND "
    mergedQuery.value = selectedQueries.join(' AND ');
  } else {
    mergedQuery.value = '';
  }
};

const executeSupplementalSearch = () => {
  if (!mergedQuery.value.trim()) {
    alert("Please enter a query before executing.");
    return;
  }

  // 1. Emit event to the main app component (SearchPage.vue) to update the RAG knowledge base
  // emit('executeSearch', mergedQuery.value);

  console.log(`Executing supplemental search: ${mergedQuery.value}`);

  // 2. Mock: Clear requests and reset UI after (simulated) execution
  // In a real app, this would wait for the backend response.
  pendingRequests.value = [];
  mergedQuery.value = '';
  isExpanded.value = false;

  // CRUCIAL: The main app component must then set the workflow state
  // of Cards 3, 4, and 5 to "Needs Rerun".
};
</script>