<template>
  <div class="sticky top-20 h-[calc(100vh-8rem)] bg-white rounded-xl shadow-xl border border-gray-200 overflow-y-auto p-4 space-y-6">
		<Text tag="h3" size="lg" weight="bold" color="gray-800" class="flex items-center space-x-2 border-b pb-3 mb-3">
			<Icon name="history" type="solid" size="md" color="indigo-600" />
			Workflow Reference (Data Lock)
		</Text>
    <div class="bg-gray-50 p-3 rounded-lg border border-gray-100">
      <div class="flex justify-between items-center cursor-pointer" @click="toggleSection('search')">
				<Text tag="h4" size="base" weight="semibold" color="gray-700" class="flex items-center space-x-2">
					<Icon name="target" type="solid" size="sm" color="red-600" />
					Step 1: Knowledge Base ({{ searchResults.length }} Sources)
				</Text>
        <Icon
          :name="isSectionOpen('search') ? 'chevron-up' : 'chevron-down'"
          type="solid"
          size="sm"
          color="gray-500"
        />
      </div>

      <div v-if="isSectionOpen('search')" class="mt-3 pt-3 border-t border-gray-200">
        <Text tag="p" size="sm" weight="medium" color="gray-600">
          Search Query:
        </Text>
        <Text tag="p" size="sm" color="gray-800" class="p-1 bg-white rounded">
          "{{ searchQuery }}"
        </Text>

        <Text tag="p" size="sm" weight="medium" color="gray-600" class="mt-2">
          Key Sources (Preview):
        </Text>
        <ul class="list-disc list-inside space-y-1 pl-1">
          <Text
            v-for="(result, index) in searchResults.slice(0, 3)"
            :key="index"
            tag="li"
            size="xs"
            color="gray-700"
          >
            {{ result.title }}
          </Text>
          <Text v-if="searchResults.length > 3" tag="li" size="xs" color="gray-500">
            ...and {{ searchResults.length - 3 }} more sources locked.
          </Text>
        </ul>
      </div>
    </div>

    <div v-if="scopeData" class="bg-gray-50 p-3 rounded-lg border border-gray-100">
      <div class="flex justify-between items-center cursor-pointer" @click="toggleSection('scope')">
				<Text tag="h4" size="base" weight="semibold" color="gray-700" class="flex items-center space-x-2">
					<Icon name="target" type="solid" size="sm" color="red-600" />
					Step 2: Defined Scope
				</Text>
        <Icon
          :name="isSectionOpen('scope') ? 'chevron-up' : 'chevron-down'"
          type="solid"
          size="sm"
          color="gray-500"
        />
      </div>

      <div v-if="isSectionOpen('scope')" class="mt-3 pt-3 border-t border-gray-200">
        <Text tag="p" size="sm" weight="medium" color="gray-600">
          Core Tension:
        </Text>
        <Text tag="p" size="sm" weight="bold" color="indigo-700" class="p-1 bg-white rounded">
          {{ scopeData.dichotomy }}
        </Text>

        <Text tag="p" size="sm" weight="medium" color="gray-600" class="mt-2">
          Focused Question:
        </Text>
        <Text tag="p" size="sm" color="gray-800" class="italic p-1 bg-white rounded">
          "{{ scopeData.question }}"
        </Text>

        <Text tag="p" size="sm" weight="medium" color="gray-600" class="mt-2">
          Assigned Agents:
        </Text>
        <div class="flex flex-wrap gap-1">
            <Text tag="span" size="sm" weight="bold" color="indigo-700">
            {{ scopeData.dichotomy }}
            </Text>
        </div>
      </div>
    </div>

    <div v-if="currentStep !== 'SCOPE'" class="p-3 rounded-lg border border-gray-200 text-center">
      <Text tag="p" size="sm" weight="medium" color="gray-500">
        Step 3/4/5 Summaries will appear here.
      </Text>
    </div>

  </div>
</template>

<script setup lang="ts">
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import { ScopeData, SearchResult, WorkflowStep } from '@/interfaces/search'; // Assuming interfaces
import { ref } from 'vue';

// --- Props ---
const props = defineProps({
  currentStep: {
    type: String as () => WorkflowStep,
    required: true,
  },
  searchQuery: {
    type: String,
    required: true,
  },
  searchResults: {
    type: Array as () => SearchResult[],
    required: true,
  },
  scopeData: {
    type: Object as () => ScopeData | null,
    default: null,
  },
});

// --- Local State for Panel Sections ---
// Tracks which section (e.g., search, scope) is currently expanded
const openSections = ref<Record<string, boolean>>({
  search: true, // Default: Step 1 data is always visible
  scope: true,  // Default: Step 2 data is visible once defined
});

// --- Methods ---
const toggleSection = (section: string) => {
  openSections.value[section] = !openSections.value[section];
};

const isSectionOpen = (section: string) => {
  return openSections.value[section] ?? false;
};
</script>