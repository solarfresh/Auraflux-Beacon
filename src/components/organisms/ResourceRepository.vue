<template>
  <div class="h-full flex flex-col p-4">
    <div class="flex-shrink-0 mb-4 space-y-2">
      <input
        v-model="searchTerm"
        placeholder="Search resources by title, summary, or notes..."
        class="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
      />
      <div class="flex space-x-2 text-sm">
        <label class="flex items-center">
          <input type="checkbox" v-model="filterWeb" class="rounded text-blue-600 focus:ring-blue-500" />
          <span class="ml-1">Web</span>
        </label>
        <label class="flex items-center">
          <input type="checkbox" v-model="filterPDF" class="rounded text-blue-600 focus:ring-blue-500" />
          <span class="ml-1">PDF</span>
        </label>
        <label class="flex items-center">
          <input type="checkbox" v-model="filterAcademic" class="rounded text-blue-600 focus:ring-blue-500" />
          <span class="ml-1">Academic</span>
        </label>
      </div>
    </div>

    <div class="flex-1 overflow-y-auto space-y-3">
      <div v-if="filteredResources.length === 0" class="text-center text-gray-500 py-8">
        No resources found matching your criteria.
      </div>

      <div
        v-for="resource in filteredResources"
        :key="resource.id"
        class="p-3 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-grab bg-white"
        draggable="true"
        @dragstart="handleDragStart(resource, $event)"
        @click="selectResource(resource)"
      >
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-semibold text-sm truncate" :title="resource.title">{{ resource.title }}</h4>
            <span :class="getSourceTypeClass(resource.source_type)" class="text-xs font-medium px-1 py-0.5 rounded-full mt-0.5 inline-block">
              {{ resource.source_type }}
            </span>
          </div>
          <button
            @click.stop="startEdit(resource)"
            class="text-gray-400 hover:text-blue-600 transition-colors ml-2"
            title="Add Notes"
          >
            <span class="icon">📝</span>
          </button>
        </div>

        <p class="text-xs text-gray-600 mt-2 line-clamp-2">
          **AI Summary:** {{ resource.summary || 'No summary available.' }}
        </p>
        <div class="mt-2 flex flex-wrap gap-1">
          <span
            v-for="keyword in resource.keywords.slice(0, 3)"
            :key="keyword"
            class="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full"
            title="AI Extracted Keyword"
          >
            {{ keyword }}
          </span>
          <span v-if="resource.user_notes" class="text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">
            User Note
          </span>
        </div>
      </div>
    </div>

    <FullScreenModalTemplate
      :is-open="isEditModalOpen"
      max-width-class="max-w-xl"
      @close="isEditModalOpen = false"
    >
      <template #header>Edit Resource Notes: {{ editingResource?.title }}</template>
      <template #content>
        <div v-if="editingResource">
          <h5 class="font-bold mb-2">AI Summary:</h5>
          <p class="text-sm mb-4 p-2 bg-gray-50 rounded">{{ editingResource.summary }}</p>

          <h5 class="font-bold mb-2">My Exploration Notes:</h5>
          <textarea
            v-model="localNotes"
            rows="5"
            class="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            placeholder="Record your thoughts, connections, or conflicts found in this resource..."
          ></textarea>

          <div class="mt-4 flex justify-end">
            <button
              @click="saveNotes"
              class="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors"
            >
              Save Notes
            </button>
          </div>
        </div>
      </template>
    </FullScreenModalTemplate>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ResourceItem } from '@/interfaces/exploration.ts';
import FullScreenModalTemplate from '@/components/templates/FullScreenModalTemplate.vue'; // Reused Modal

// --- PROPS ---
const props = defineProps<{
  resources: ResourceItem[];
}>();

// --- EVENTS ---
const emit = defineEmits<{
  (e: 'update-resource', resource: ResourceItem): void;
  (e: 'add-to-canvas', resource: ResourceItem, position: { x: number, y: number }): void; // If an explicit button is used instead of drag
}>();

// --- LOCAL STATE ---
const searchTerm = ref('');
const filterWeb = ref(true);
const filterPDF = ref(true);
const filterAcademic = ref(true);

const isEditModalOpen = ref(false);
const editingResource = ref<ResourceItem | null>(null);
const localNotes = ref('');

// --- COMPUTED: FILTERING ---

const filteredResources = computed(() => {
  const { resources } = props;
  const term = searchTerm.value.toLowerCase().trim();

  // 1. Filter by Source Type
  const typeFiltered = resources.filter(res => {
    switch (res.source_type) {
      case 'WEB': return filterWeb.value;
      case 'PDF': return filterPDF.value;
      case 'ACADEMIC': return filterAcademic.value;
      default: return true;
    }
  });

  // 2. Filter by Search Term
  if (!term) return typeFiltered;

  return typeFiltered.filter(res =>
    res.title.toLowerCase().includes(term) ||
    res.summary.toLowerCase().includes(term) ||
    res.user_notes.toLowerCase().includes(term) ||
    res.keywords.some(k => k.toLowerCase().includes(term))
  );
});

// --- METHODS: UI & STYLES ---

function getSourceTypeClass(type: ResourceItem['source_type']) {
  switch (type) {
    case 'WEB': return 'bg-blue-100 text-blue-800';
    case 'PDF': return 'bg-purple-100 text-purple-800';
    case 'ACADEMIC': return 'bg-red-100 text-red-800';
    default: return 'bg-gray-100 text-gray-800';
  }
}

function selectResource(resource: ResourceItem) {
  // Can be used to highlight the resource or show quick preview
  console.log(`Resource selected: ${resource.title}`);
}

// --- METHODS: EDITING ---

function startEdit(resource: ResourceItem) {
  editingResource.value = resource;
  localNotes.value = resource.user_notes;
  isEditModalOpen.value = true;
}

function saveNotes() {
  if (editingResource.value) {
    const updatedResource: ResourceItem = {
      ...editingResource.value,
      user_notes: localNotes.value.trim()
    };
    emit('update-resource', updatedResource);
    isEditModalOpen.value = false;
  }
}

// --- METHODS: DRAG & DROP ---

/**
 * Handles the start of a drag operation.
 * Sets the data to be transferred, which is the ResourceItem object itself.
 */
function handleDragStart(resource: ResourceItem, event: DragEvent) {
  // Store resource data as JSON
  event.dataTransfer?.setData('resource/json', JSON.stringify(resource));
  // Set the drag effect
  event.dataTransfer!.effectAllowed = 'move';
}
</script>

<style scoped>
.icon {
  font-size: 1.1rem;
  line-height: 1;
}
/* Ensure the list takes the remaining vertical space */
.flex-1 {
  min-height: 0;
}
/* Utility for clamping lines in summary */
.line-clamp-2 {
  overflow: hidden;

  /* Standard CSS property for line clamping */
  line-clamp: 2;

  /* WebKit prefix for maximum browser compatibility (Chrome, Safari, older Edge) */
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
}
</style>