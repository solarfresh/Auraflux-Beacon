<template>
  <div class="space-y-8">
    <div class="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-4">
      <div class="flex items-center space-x-2 mb-2">
        <Icon name="ArrowsPointingIn" size="sm" color="indigo-600" />
        <Text tag="span" size="sm" weight="semibold" color="gray-700">
          Define New Boundary
        </Text>
      </div>

      <div class="flex flex-col space-y-3">
        <Input
          v-model="newScopeText"
          placeholder="e.g., Only English publications, Post-2010 studies..."
          size="md"
          @keyup.enter="addScope"
        />

        <div class="flex items-center justify-between gap-4">
          <div class="flex bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            <button
              v-for="type in (['INCLUSION', 'EXCLUSION'] as const)"
              :key="type"
              @click="activeType = type"
              :class="[
                'px-4 py-1.5 text-xs font-bold rounded-md transition-all',
                activeType === type
                  ? (type === 'INCLUSION' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white')
                  : 'text-gray-500 hover:bg-gray-50'
              ]"
            >
              {{ type }}
            </button>
          </div>

          <Button variant="primary" size="sm" @click="addScope" :disabled="!newScopeText.trim()">
            Add to Scope
          </Button>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-3">
        <div class="flex items-center space-x-2 px-1">
          <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
          <Text tag="h4" size="sm" weight="bold" color="emerald-900">Inclusions</Text>
        </div>

        <div class="min-h-[150px] space-y-2">
          <div
            v-for="(item, index) in inclusions"
            :key="index"
            class="flex items-start justify-between bg-emerald-50/50 border border-emerald-100 p-3 rounded-lg group"
          >
            <Text tag="p" size="xs" color="emerald-900" class="leading-relaxed flex-1 mr-2">
              {{ item.label }}
            </Text>
            <IconButton
              variant="danger"
              size="xs"
              icon-name="XMark"
              @click="removeScope(item.label)"
            />
          </div>
          <Text v-if="inclusions.length === 0" tag="p" size="xs" color="gray-400" class="italic p-4 text-center">
            No inclusion criteria defined.
          </Text>
        </div>
      </div>

      <div class="space-y-3">
        <div class="flex items-center space-x-2 px-1">
          <div class="w-2 h-2 rounded-full bg-rose-500"></div>
          <Text tag="h4" size="sm" weight="bold" color="rose-900">Exclusions</Text>
        </div>

        <div class="min-h-[150px] space-y-2">
          <div
            v-for="(item, index) in exclusions"
            :key="index"
            class="flex items-start justify-between bg-rose-50/50 border border-rose-100 p-3 rounded-lg group"
          >
            <Text tag="p" size="xs" color="rose-900" class="leading-relaxed flex-1 mr-2">
              {{ item.label }}
            </Text>
            <IconButton
              variant="danger"
              size="xs"
              icon-name="XMark"
              @click="removeScope(item.label)"
            />
          </div>
          <Text v-if="exclusions.length === 0" tag="p" size="xs" color="gray-400" class="italic p-4 text-center">
            No exclusion criteria defined.
          </Text>
        </div>
      </div>
    </div>

    <div class="flex justify-end space-x-3 pt-6 border-t border-gray-200">
      <Button variant="secondary" @click="$emit('cancel')">Cancel</Button>
      <Button variant="primary" @click="handleSave">Save Scope Changes</Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ProcessedScope } from '@/interfaces/initiation';

// Atoms
import Text from '@/components/atoms/Text.vue';
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Input from '@/components/atoms/Input.vue';
import IconButton from '@/components/atoms/IconButton.vue';

/**
 * English Documentation:
 * This organism manages the inclusion and exclusion criteria of the research.
 * It handles the creation of ProcessedScope objects with specific boundaryTypes.
 */
const props = defineProps<{
  initialValue: ProcessedScope[];
}>();

const emit = defineEmits<{
  (e: 'save', value: ProcessedScope[]): void;
  (e: 'cancel'): void;
}>();

// --- STATE ---
const localScope = ref<ProcessedScope[]>([...props.initialValue]);
const newScopeText = ref('');
const activeType = ref<'INCLUSION' | 'EXCLUSION'>('INCLUSION');

// --- COMPUTED ---
const inclusions = computed(() => localScope.value.filter(s => s.boundaryType === 'INCLUSION'));
const exclusions = computed(() => localScope.value.filter(s => s.boundaryType === 'EXCLUSION'));

// --- METHODS ---

/**
 * Validates and adds a new scope entry.
 * Prevents duplicate labels across both types.
 */
function addScope() {
  const text = newScopeText.value.trim();
  if (!text) return;

  if (localScope.value.some(s => s.label.toLowerCase() === text.toLowerCase())) {
    newScopeText.value = '';
    return;
  }

  localScope.value.push({
    id: '',
    label: text,
    boundaryType: activeType.value,
    entityStatus: 'USER_DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  newScopeText.value = '';
}

/**
 * Removes a scope entry by its unique label.
 */
function removeScope(label: string) {
  localScope.value = localScope.value.filter(s => s.label !== label);
}

/** Returns the updated collection to the parent */
function handleSave() {
  emit('save', localScope.value);
}
</script>