<template>
  <div class="flex flex-col h-full space-y-6">
    <div class="bg-gray-50/80 p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4">
      <div class="flex items-center gap-2">
        <div class="p-1.5 bg-indigo-100 rounded-lg text-indigo-600">
          <Icon name="ArrowsPointingIn" size="xs" />
        </div>
        <Text tag="span" size="sm" weight="bold" color="gray-800">
          Define Research Boundary
        </Text>
      </div>

      <div class="flex flex-col gap-4">
        <Input
          v-model="newScopeText"
          placeholder="e.g., Only English publications, Post-2010 studies..."
          size="md"
          class="w-full bg-white"
          @keyup.enter="addScope"
        />

        <div class="flex items-center justify-between">
          <div class="flex bg-gray-200/50 p-1 rounded-xl">
            <button
              v-for="type in (['INCLUSION', 'EXCLUSION'] as const)"
              :key="type"
              @click="activeType = type"
              :class="[
                'px-5 py-1.5 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200',
                activeType === type
                  ? (type === 'INCLUSION' ? 'bg-emerald-600 text-white shadow-md' : 'bg-rose-600 text-white shadow-md')
                  : 'text-gray-500 hover:text-gray-700'
              ]"
            >
              {{ type }}
            </button>
          </div>

          <Button
            variant="primary"
            size="md"
            @click="addScope"
            :disabled="!newScopeText.trim()"
          >
            Add to Scope
          </Button>
        </div>
      </div>
    </div>

    <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 overflow-hidden">

      <div class="flex flex-col space-y-3 min-h-0">
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
            <Text tag="h4" size="sm" weight="bold" color="emerald-900">Inclusions</Text>
          </div>
          <Badge variant="emerald" size="xs">{{ inclusions.length }}</Badge>
        </div>

        <div class="flex-1 overflow-y-auto space-y-2 pr-1 stable-gutter">
          <div
            v-for="item in inclusions"
            :key="item.label"
            class="flex items-start justify-between bg-emerald-50/40 border border-emerald-100 p-3 rounded-xl group hover:border-emerald-300 transition-all"
          >
            <Text tag="p" size="xs" color="emerald-950" class="leading-relaxed flex-1 mr-3">
              {{ item.label }}
            </Text>
            <IconButton
              variant="danger"
              size="xs"
              icon-name="XMark"
              class="opacity-0 group-hover:opacity-100 transition-opacity"
              @click="removeScope(item.label)"
            />
          </div>
          <div v-if="inclusions.length === 0" class="h-32 flex flex-col items-center justify-center border border-dashed border-gray-100 rounded-xl bg-gray-50/30">
            <Text size="xs" color="gray-400" italic>No inclusion criteria.</Text>
          </div>
        </div>
      </div>

      <div class="flex flex-col space-y-3 min-h-0">
        <div class="flex items-center justify-between px-1">
          <div class="flex items-center gap-2">
            <div class="w-2 h-2 rounded-full bg-rose-500"></div>
            <Text tag="h4" size="sm" weight="bold" color="rose-900">Exclusions</Text>
          </div>
          <Badge variant="red" size="xs">{{ exclusions.length }}</Badge>
        </div>

        <div class="flex-1 overflow-y-auto space-y-2 pr-1 stable-gutter">
          <div
            v-for="item in exclusions"
            :key="item.label"
            class="flex items-start justify-between bg-rose-50/40 border border-rose-100 p-3 rounded-xl group hover:border-rose-300 transition-all"
          >
            <Text tag="p" size="xs" color="rose-950" class="leading-relaxed flex-1 mr-3">
              {{ item.label }}
            </Text>
            <IconButton
              variant="danger"
              size="xs"
              icon-name="XMark"
              class="opacity-0 group-hover:opacity-100 transition-opacity"
              @click="removeScope(item.label)"
            />
          </div>
          <div v-if="exclusions.length === 0" class="h-32 flex flex-col items-center justify-center border border-dashed border-gray-100 rounded-xl bg-gray-50/30">
            <Text size="xs" color="gray-400" italic>No exclusion criteria.</Text>
          </div>
        </div>
      </div>
    </div>

    <div class="flex justify-end items-center space-x-3 pt-6 border-t border-gray-100">
      <Button variant="tertiary" size="md" @click="$emit('cancel')">
        Cancel
      </Button>
      <Button variant="primary" size="md" @click="handleSave">
        Save Scope Changes
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ProcessedScope } from '@/interfaces/initiation';

// Atoms
import Text from '@/components/atoms/Text.vue';
import Button from '@/components/atoms/actions/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Input from '@/components/atoms/Input.vue';
import IconButton from '@/components/atoms/IconButton.vue';
import Badge from '@/components/atoms/Badge.vue';

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

function addScope() {
  const text = newScopeText.value.trim();
  if (!text) return;

  if (localScope.value.some(s => s.label.toLowerCase() === text.toLowerCase())) {
    newScopeText.value = '';
    return;
  }

  localScope.value.unshift({ // Add to top for visibility
    id: `scope-${Date.now()}`,
    label: text,
    boundaryType: activeType.value,
    entityStatus: 'USER_DRAFT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  newScopeText.value = '';
}

function removeScope(label: string) {
  localScope.value = localScope.value.filter(s => s.label !== label);
}

function handleSave() {
  emit('save', localScope.value);
}
</script>