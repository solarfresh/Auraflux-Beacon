<template>
  <div class="flex flex-col h-full bg-white">
    <header class="p-6 pb-4 border-b border-gray-100 flex-shrink-0">
      <div class="flex items-center justify-between mb-2">
        <div class="flex items-center gap-3">
          <div
            class="p-2.5 rounded-xl shadow-sm"
            :class="initialScopeElement.boundaryType === 'INCLUSION' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'"
          >
            <Icon :name="initialScopeElement.boundaryType === 'INCLUSION' ? 'PlusCircle' : 'MinusCircle'" size="md" />
          </div>
          <div class="flex flex-col">
            <Text tag="h2" size="xl" weight="bold" color="gray-900">
              Refine Scope: {{ initialScopeElement.label }}
            </Text>
            <Badge :variant="initialScopeElement.boundaryType === 'INCLUSION' ? 'emerald' : 'red'" size="xs">
              {{ initialScopeElement.boundaryType }} CRITERIA
            </Badge>
          </div>
        </div>
      </div>
    </header>

    <main class="flex-1 p-6 space-y-6 overflow-y-auto stable-gutter">

      <div class="space-y-1.5">
        <div class="flex justify-between items-center">
          <Text tag="label" for="scope-value-input" size="sm" weight="bold" color="gray-700">
            Boundary Specification
          </Text>
          <Badge v-if="isValueModified" variant="amber" size="xs" class="animate-pulse">
            Unsaved Changes
          </Badge>
        </div>

        <Textarea
          id="scope-value-input"
          v-model="draftValue"
          :rows="3"
          :placeholder="`Describe the specific parameters for ${initialScopeElement.label}...`"
          class="w-full text-md font-medium leading-relaxed p-4"
          :class="{ 'border-red-500 ring-red-100': !draftValue?.trim() }"
        />
        <p v-if="!draftValue?.trim()" class="text-xs text-red-500 flex items-center gap-1">
          <Icon name="ExclamationCircle" size="xs" />
          Specification cannot be empty.
        </p>
      </div>

      <div
        class="p-4 rounded-2xl border flex items-center justify-between transition-all"
        :class="statusUI.bgClass"
      >
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-lg bg-white shadow-sm" :class="statusUI.iconColor">
            <Icon :name="statusUI.icon" size="sm" />
          </div>
          <div class="flex flex-col">
            <Text tag="span" size="xs" weight="bold" class="uppercase tracking-widest text-gray-400">
              Entity Status
            </Text>
            <Text tag="span" size="sm" weight="bold" :class="statusUI.textColor">
              {{ initialScopeElement.entityStatus }}
            </Text>
          </div>
        </div>
      </div>

      <div class="p-5 bg-amber-50/50 border border-amber-100 rounded-2xl space-y-3">
        <div class="flex items-center gap-2">
          <Icon name="LightBulb" size="sm" class="text-amber-500" />
          <Text tag="h3" size="sm" weight="bold" color="amber-900">
            Strategic Impact
          </Text>
        </div>
        <div class="space-y-2">
          <div class="flex items-center justify-between bg-white p-2 rounded-lg border border-amber-100 shadow-sm">
            <Text size="xs" color="gray-500">Global Feasibility</Text>
            <Badge :variant="feasibilityStatus === 'HIGH' ? 'emerald' : 'amber'" size="xs">
              {{ feasibilityStatus }}
            </Badge>
          </div>
          <Text tag="p" size="xs" color="amber-800" class="leading-relaxed">
            Precisely defining <strong>{{ initialScopeElement.label }}</strong> will directly influence
            the volume and quality of resources the system can retrieve.
          </Text>
        </div>
      </div>
    </main>

    <footer class="p-4 bg-gray-50 border-t border-gray-100 flex-shrink-0">
      <div class="flex justify-end items-center gap-3">
        <Button variant="tertiary" size="md" @click="handleCancelAndCheck">
          Cancel
        </Button>

        <template v-if="!isLOCKED">
          <Button
            variant="secondary"
            size="md"
            @click="handleUnifiedSubmit('ON_HOLD')"
            :disabled="!draftValue?.trim()"
          >
            <Icon name="ArchiveBox" size="sm" class="mr-2" />
            Put On Hold
          </Button>

          <Button
            variant="primary"
            size="md"
            @click="handleUnifiedSubmit('LOCKED')"
            :disabled="!draftValue?.trim()"
          >
            <Icon name="LockClosed" size="sm" class="mr-2" />
            Lock Scope
          </Button>
        </template>

        <template v-else>
          <Button
            variant="secondary"
            size="md"
            @click="handleUnifiedSubmit('ON_HOLD')"
          >
            <Icon name="ArchiveBox" size="sm" class="mr-2" />
            Unlock & Hold
          </Button>

          <Button
            variant="primary"
            size="md"
            @click="handleUnifiedSubmit('LOCKED')"
            :disabled="!isValueModified"
          >
            <Icon name="DocumentCheck" size="sm" class="mr-2" />
            Save Changes
          </Button>
        </template>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { apiService } from '@/api/apiService';
import { useInitiativeStore } from '@/stores/initiation';
import type { EntityStatus, FeasibilityStatus } from '@/interfaces/core';
import type { ProcessedScope } from '@/interfaces/initiation';

// Atoms
import Button from '@/components/atoms/actions/Button.vue';
import Icon from '@/components/atoms/data-display/Icon.vue';
import Text from '@/components/atoms/data-display/Text.vue';
import Textarea from '@/components/atoms/Textarea.vue';
import Badge from '@/components/atoms/data-display/Badge.vue';

const props = defineProps<{
  scopeIndex: number;
  initialScopeElement: ProcessedScope;
  feasibilityStatus: FeasibilityStatus;
}>();

const emit = defineEmits<{
  (e: 'close-modal'): void;
}>();

const initiativeStore = useInitiativeStore();

// --- Local State ---
const draftValue = ref(props.initialScopeElement.rationale);

watch(() => props.initialScopeElement.rationale, (newVal) => {
  draftValue.value = newVal;
});

// --- Computed UI Logic ---
const isLOCKED = computed(() => props.initialScopeElement.entityStatus === 'LOCKED');
const isValueModified = computed(() => draftValue.value?.trim() !== props.initialScopeElement.rationale);

const statusUI = computed(() => {
  const status = props.initialScopeElement.entityStatus;
  const config = {
    LOCKED: { bgClass: 'bg-indigo-50 border-indigo-100', textColor: 'text-indigo-700', iconColor: 'text-indigo-600', icon: 'LockClosed' },
    AI_EXTRACTED: { bgClass: 'bg-amber-50 border-amber-100', textColor: 'text-amber-700', iconColor: 'text-amber-600', icon: 'Sparkles' },
    ON_HOLD: { bgClass: 'bg-gray-50 border-gray-200', textColor: 'text-gray-500', iconColor: 'text-gray-400', icon: 'ArchiveBox' },
    USER_DRAFT: { bgClass: 'bg-white border-gray-200', textColor: 'text-gray-800', iconColor: 'text-gray-600', icon: 'PencilSquare' }
  };
  return config[status as keyof typeof config] || config.USER_DRAFT;
});

// --- Actions ---

async function handleUnifiedSubmit(targetStatus: EntityStatus) {
  const value = draftValue.value?.trim();
  if (!value) return;

  const id = props.initialScopeElement.id;
  const label = props.initialScopeElement.label;

  // Persistence
  if (id) {
    await apiService.knowledge.scopes.update(id, label, value, targetStatus);
  } else {
    await apiService.workflows.scopes.create(label, value, targetStatus);
  }

  initiativeStore.createOrUpdateTopicScopes(id, label, value, targetStatus);
  emit('close-modal');
}

function handleCancelAndCheck() {
  if (isValueModified.value) {
    if (window.confirm('Discard unsaved scope changes?')) {
      emit('close-modal');
    }
  } else {
    emit('close-modal');
  }
}
</script>