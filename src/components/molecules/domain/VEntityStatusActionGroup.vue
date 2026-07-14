<template>
  <VCluster justify="end" gap="md" class="w-full">
<!--
    <VButton variant="tertiary" size="sm" @click="emit('cancel')">
      Cancel
    </VButton>
 -->
    <template v-if="!props.isLocked">
      <VButton
        v-if="!props.isNew"
        variant="danger"
        size="sm"
        icon-name="ArchiveBox"
        :disabled="props.disabled"
        @click="emit('submit', 'ON_HOLD')"
      >
        {{ props.labels.unlockedHold || 'Put On Hold' }}
      </VButton>

      <VButton
        variant="secondary"
        size="sm"
        icon-name="PencilSquare"
        :disabled="props.disabled"
        @click="emit('submit', 'USER_DRAFT')"
      >
        {{ props.labels.unlockedDraft || 'Save as Draft' }}
      </VButton>

      <VButton
        variant="primary"
        size="sm"
        :icon-name="props.labels.unlockedPrimaryIcon || 'LockClosed'"
        :class="props.labels.unlockedPrimaryClass"
        :disabled="props.disabled"
        @click="emit('submit', 'LOCKED')"
      >
        {{ props.labels.unlockedPrimary || 'Lock' }}
      </VButton>
    </template>

    <template v-else>
      <VButton
        variant="danger"
        size="sm"
        icon-name="ArchiveBox"
        @click="emit('submit', 'ON_HOLD')"
      >
        {{ props.labels.lockedHold || 'Unlock & Hold' }}
      </VButton>

      <VButton
        variant="primary"
        size="sm"
        icon-name="DocumentCheck"
        :disabled="props.disabled || !props.isModified"
        @click="emit('submit', 'LOCKED')"
      >
        {{ props.labels.lockedPrimary || 'Save Changes' }}
      </VButton>
    </template>
  </VCluster>
</template>

<script setup lang="ts">
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';

interface ActionGroupLabels {
  unlockedDraft?: string;
  unlockedHold?: string;
  unlockedPrimary?: string;
  unlockedPrimaryIcon?: string;
  unlockedPrimaryClass?: string;
  lockedHold?: string;
  lockedPrimary?: string;
}

const props = withDefaults(defineProps<{
  isNew: boolean;
  isLocked: boolean;
  isModified: boolean;
  disabled: boolean;
  labels?: ActionGroupLabels;
}>(), {
  labels: () => ({})
});

const emit = defineEmits<{
  (e: 'cancel'): void;
  (e: 'submit', targetStatus: 'LOCKED' | 'ON_HOLD' | 'USER_DRAFT'): void;
}>();
</script>