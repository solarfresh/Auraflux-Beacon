<template>
  <div class="space-y-6 p-6">
    <Text tag="h2" size="2xl" weight="bold" color="gray-900">
      Refine Research Scope: {{ initialScopeElement.label }}
    </Text>
    <Text tag="p" size="md" color="gray-600">
      Define the specific
      <Text tag="span" size="md" weight="bold" color="gray-900">
        {{ initialScopeElement.label }}
      </Text>
      boundary for your research. Changes will only be saved when you click
      <Text tag="span" size="md" weight="bold" color="gray-900">
        Lock Scope
      </Text>
        or
      <Text tag="span" size="md" weight="bold" color="gray-900">
        Put On Hold
      </Text>
      .
    </Text>

    <div class="space-y-2">
      <Text tag="label" size="sm" weight="medium" color="gray-700" for="scope-value-input">
        {{ initialScopeElement.label }} Value
      </Text>
      <Textarea
        id="scope-value-input"
        v-model="draftValue"
        :rows="1"
        :size="'md'"
        :placeholder="`Enter a specific value for ${initialScopeElement.label}`"
        :class="{ 'border-red-500': !draftValue?.trim() }"
      />
      <p v-if="!draftValue?.trim()" class="text-xs text-red-500">Scope value cannot be empty.</p>
    </div>

    <div class="flex justify-between items-center p-3 rounded-lg border"
         :class="statusClasses">

      <Text tag="span" size="sm" weight="medium" :color="statusTextColor">
        Current Status: <span class="font-bold">{{ props.initialScopeElement.EntityStatus }}</span>
        <span v-if="isValueModified" class="text-xs text-red-500 italic ml-2">(Unsaved Value Changes)</span>
      </Text>

      <Icon :name="statusIcon" type="solid" size="sm" :color="statusIconColor" />
    </div>

    <div class="p-4 bg-yellow-50 border border-yellow-200 rounded-lg space-y-2">
      <div class="flex items-center space-x-2">
        <Icon name="ExclamationTriangle" type="solid" size="sm" color="yellow-600" />
        <Text tag="h3" size="base" weight="semibold" color="yellow-700">
          Scope Validation
        </Text>
      </div>
      <Text tag="p" size="sm" color="yellow-600">
        <Text tag="span" size="md" weight="bold" color="gray-900">
          Current Feasibility Status: {{ feasibilityStatus }}.
        </Text>
        Precisely defining
        <Text tag="span" size="md" weight="bold" color="gray-900">
          {{ initialScopeElement.label }}
        </Text>
        may improve resource abundance.
      </Text>
    </div>

    <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">

      <Button variant="secondary" @click="handleCancelAndCheck">
        Cancel
      </Button>

      <Button
        v-if="!isLOCKED"
        variant="tertiary"
        @click="handleUnifiedSubmit('ON_HOLD')"
        :disabled="!draftValue?.trim()"
      >
        <Icon name="ArchiveBox" type="outline" size="sm" />
        Put On Hold
      </Button>

      <Button
        v-if="!isLOCKED"
        @click="handleUnifiedSubmit('LOCKED')"
        :disabled="!draftValue?.trim()"
        variant="primary"
      >
        <Icon name="LockClosed" type="solid" size="sm" />
        Lock Scope
      </Button>

      <Button
        v-else
        @click="handleUnifiedSubmit(isValueModified ? 'LOCKED' : 'ON_HOLD')"
        :variant="isValueModified ? 'primary' : 'tertiary'"
      >
        <Icon :name="isValueModified ? 'DocumentCheck' : 'ArchiveBox'" type="solid" size="sm" />
        {{ isValueModified ? 'Save Value & Maintain Lock' : 'Unlock & Put On Hold' }}
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { apiService } from '@/api/apiService';
import { ref, computed, watch } from 'vue';
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';
import Textarea from '@/components/atoms/Textarea.vue';
import { useInitiativeStore } from '@/stores/initiation';
import type { ProcessedScope } from '@/interfaces/initiation';
import type { EntityStatus } from '@/interfaces/workflow';
import type { FeasibilityStatus } from '@/interfaces/core';

const initiativeStore = useInitiativeStore();

// --- Props ---
const props = defineProps<{
    /** The index of the element being edited. Crucial for updating the store. */
    scopeIndex: number;
    /** The single scope element data object. */
    initialScopeElement: ProcessedScope;
    /** Current feasibility status for feedback. */
    feasibilityStatus: FeasibilityStatus;
}>();

// --- Emits ---
const emit = defineEmits<{
    /** Emitted when the user submits changes (value and status) through a commitment button. */
    (e: 'scopeUpdate', payload: { index: number, newValue: string, newStatus: EntityStatus }): void;
    /** Emitted to close the modal. */
    (e: 'close-modal'): void;
}>();


// --- State ---
// Local state for editing the value (Deferred Save)
const draftValue = ref(props.initialScopeElement.rationale);

// Watcher to reset draft value if the initialScopeElement prop changes externally
watch(() => props.initialScopeElement.rationale, (newValue) => {
    draftValue.value = newValue;
});

const scopeElementId = computed(() => props.initialScopeElement.id); // Assuming ID exists

// --- Computed Properties for Status Management and UI ---

const isLOCKED = computed(() => props.initialScopeElement.EntityStatus === 'LOCKED');
const isAI_EXTRACTED = computed(() => props.initialScopeElement.EntityStatus === 'AI_EXTRACTED'); // For potential AI context

/** Checks if the local value is different from the initial value. */
const isValueModified = computed(() => {
    return draftValue.value?.trim() !== props.initialScopeElement.rationale;
});

// --- UI Styling (Copied from KeywordRefinementForm logic) ---

/** Tailwind classes for the status box based on the current scope status. */
const statusClasses = computed(() => {
    switch (props.initialScopeElement.EntityStatus) {
        case 'LOCKED': return 'bg-indigo-50 border-indigo-200';
        case 'AI_EXTRACTED':
        case 'USER_DRAFT':
            return 'bg-yellow-50 border-yellow-200';
        case 'ON_HOLD': return 'bg-gray-100 border-gray-300';
        default: return 'bg-white border-gray-200';
    }
});

/** Text color based on status. */
const statusTextColor = computed(() => {
    switch (props.initialScopeElement.EntityStatus) {
        case 'LOCKED': return 'indigo-700';
        case 'AI_EXTRACTED':
        case 'USER_DRAFT':
            return 'yellow-800';
        case 'ON_HOLD': return 'gray-500';
        default: return 'gray-800';
    }
});

/** Icon based on status. */
const statusIcon = computed(() => {
    switch (props.initialScopeElement.EntityStatus) {
        case 'LOCKED': return 'LockClosed';
        case 'AI_EXTRACTED': return 'Sparkles';
        case 'ON_HOLD': return 'ArchiveBox';
        case 'USER_DRAFT':
        default: return 'PencilSquare';
    }
});

/** Icon color based on status. */
const statusIconColor = computed(() => {
    switch (props.initialScopeElement.EntityStatus) {
        case 'LOCKED': return 'indigo-600';
        case 'AI_EXTRACTED': return 'yellow-600';
        case 'ON_HOLD': return 'gray-500';
        case 'USER_DRAFT':
        default: return 'gray-600';
    }
});


// --- Methods ---

/** Handles the unified submission of the scope element status and value. */
async function handleUnifiedSubmit(targetStatus: EntityStatus) {
    const value = draftValue.value?.trim();
    if (!value) return;

    let finalStatus = targetStatus;

    // Logic similar to KeywordRefinementForm's unified submit
    if (isLOCKED.value && targetStatus === 'LOCKED') {
        finalStatus = 'LOCKED'; // Maintain lock after saving value
    } else if (isLOCKED.value && targetStatus === 'ON_HOLD') {
        finalStatus = 'ON_HOLD'; // Unlock and put on hold
    }
    // For DRAFT/AI_EXTRACTED, targetStatus is already LOCKED or ON_HOLD, which is correct.

    // API Call (Simulated/Corrected based on expected Scope endpoint)
    let response = null;
    if (scopeElementId.value) {
      response = await apiService.workflows.scopes.update(scopeElementId.value, props.initialScopeElement.label, value, finalStatus);
    }
    else {
      response = await apiService.workflows.scopes.create(props.initialScopeElement.label, value, finalStatus);
    }

    initiativeStore.createOrUpdateTopicScopes(scopeElementId.value, props.initialScopeElement.label, value, finalStatus);

    // 3. Close the modal
    emit('close-modal');
}


function handleCancelAndCheck() {
    if (isValueModified.value) {
        const confirmation = window.confirm(
            'You have unsaved value changes. Are you sure you want to cancel and discard them?'
        );
        if (confirmation) {
            emit('close-modal');
        }
    } else {
        emit('close-modal');
    }
}
</script>