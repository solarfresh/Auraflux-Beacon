<template>
  <div class="flex flex-col gap-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">

    <section class="space-y-4">
      <div class="flex items-center gap-2 border-l-2 border-indigo-600 pl-3">
        <VTypography tag="h4" size="md" weight="bold" color="gray-900">Core Research Question</VTypography>
      </div>
      <VTypography tag="p" size="sm" color="gray-500" class="italic leading-relaxed">
        The ultimate objective of this ISP session. Changing this will trigger a full re-evaluation of node health.
      </VTypography>

      <Textarea
        v-model="localData.finalQuestion"
        size="lg"
        :rows="4"
        placeholder="Enter your refined research question..."
        class="border-gray-300 focus:border-indigo-600 focus:ring-indigo-600"
      />
    </section>

    <section class="space-y-4">
      <div class="flex items-center gap-2 border-l-2 border-emerald-600 pl-3">
        <VTypography tag="h4" size="md" weight="bold" color="gray-900">Topic Scope & Boundaries</VTypography>
      </div>
      <div class="grid grid-cols-2 gap-6">
        <div class="space-y-2">
          <VTypography tag="label" size="xs" weight="semibold" color="gray-500" class="uppercase tracking-wider">Inclusions</VTypography>
          <Input
            v-model="localData.scopeIn"
            size="md"
            placeholder="e.g., AI ethics, 2024 trends..."
            class="focus:ring-emerald-600 focus:border-emerald-600"
          />
        </div>
        <div class="space-y-2">
          <VTypography tag="label" size="xs" weight="semibold" color="gray-500" class="uppercase tracking-wider">Exclusions</VTypography
          <Input
            v-model="localData.scopeOut"
            size="md"
            placeholder="e.g., exclude healthcare..."
            class="focus:ring-red-600 focus:border-red-600"
          />
        </div>
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex items-center gap-2 border-l-2 border-amber-500 pl-3">
        <VTypography tag="h4" size="md" weight="bold" color="gray-900">Knowledge Anchors</VTypography>
      </div>

      <div class="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[56px] items-center">
        <div
          v-for="(tag, index) in localData.keywords"
          :key="index"
          class="flex items-center gap-2 px-2.5 py-1 bg-white rounded border border-gray-300 shadow-sm hover:border-amber-500 transition-colors"
        >
          <VTypography tag="span" size="xs" color="gray-700">{{ tag }}</VTypography>
          <button @click="removeTag(index)" class="text-gray-400 hover:text-red-500 text-lg leading-none transition-colors">×</button>
        </div>

        <div class="flex-grow min-w-[150px]">
          <Input
            v-model="tempTag"
            variant="search"
            size="sm"
            placeholder="Add keyword + Enter"
            class="!bg-transparent !border-none !ring-0 !shadow-none text-gray-700"
            @keydown.enter="addTag"
          />
        </div>
      </div>
    </section>

    <footer class="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
      <Button variant="tertiary" @click="$emit('close')">
        <VTypography tag="span" size="sm" color="gray-500">Cancel</VTypography>
      </Button>
      <Button variant="primary" @click="handleSave" class="px-8">
        <VTypography tag="span" size="sm" weight="bold" color="white">Apply Alignment</VTypography>
      </Button>
    </footer>

  </div>
</template>

<script setup lang="ts">
/**
 * FocusAligner.vue
 * Re-aligned for Light Mode design.
 * Using standard grey scales (gray-50 to gray-900) instead of dark-mode slate.
 */
import { ref, reactive } from 'vue';
import { useExplorationStore } from '@/stores/exploration';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import Button from '@/components/atoms/actions/Button.vue';
import VTypographyarea from '@/components/atoms/forms/Textarea.vue';
import Input from '@/components/atoms/forms/Input.vue';

import type { ManagementType } from '@/interfaces/exploration.ts';

const props = defineProps<{
  type: ManagementType;
  initialData: any;
}>();

const emit = defineEmits(['update-focus', 'close']);
const store = useExplorationStore();

const tempTag = ref('');
const localData = reactive({
  finalQuestion: props.initialData?.finalQuestion || '',
  scopeIn: props.initialData?.scopeIn || '',
  scopeOut: props.initialData?.scopeOut || '',
  keywords: [...(props.initialData?.keywords || [])]
});

function addTag() {
  const val = tempTag.value.trim();
  if (val && !localData.keywords.includes(val)) {
    localData.keywords.push(val);
    tempTag.value = '';
  }
}

function removeTag(index: number) {
  localData.keywords.splice(index, 1);
}

function handleSave() {
  // Store update logic is currently commented out as per your snippet
  // store.updateProjectFocus({ ...localData });
  emit('update-focus', localData);
  emit('close');
}
</script>