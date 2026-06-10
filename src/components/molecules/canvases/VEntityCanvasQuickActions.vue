<template>
  <VCluster gap="xs" align="center" class="bg-white p-1.5 rounded-lg shadow-lg border border-slate-200 backdrop-blur-sm select-none">

    <template v-if="props.status === 'AI_EXTRACTED'">
      <VButton
        variant="ghost"
        size="xs"
        class="text-rose-600 hover:bg-rose-50!"
        icon-name="XMark"
        title="'Reject & Discard'"
        @click="emit('action', 'REJECT')"
      >
        Reject
      </VButton>

      <VButton
        variant="primary"
        size="xs"
        class="bg-emerald-600! hover:bg-emerald-700!"
        icon-name="Check"
        title="'Accept & Verify'"
        @click="emit('action', 'ACCEPT')"
      >
        Accept
      </VButton>
    </template>

    <template v-else>
      <VButton
        v-if="props.status !== 'ON_HOLD'"
        variant="ghost"
        size="xs"
        class="text-slate-600"
        icon-name="ArchiveBox"
        title="'Put On Hold'"
        @click="emit('action', 'HOLD')"
      />
      <VButton
        v-else
        variant="ghost"
        size="xs"
        class="text-indigo-600 hover:bg-indigo-50!"
        icon-name="LockOpen"
        title="'Unlock to Draft'"
        @click="emit('action', 'DRAFT')"
      />

      <VButton
        v-if="props.status !== 'LOCKED'"
        variant="ghost"
        size="xs"
        class="text-slate-600 hover:text-emerald-600!"
        icon-name="LockClosed"
        title="'Lock Strategy'"
        @click="emit('action', 'LOCK')"
      />

      <div class="h-4 w-px bg-slate-200 mx-1" />

      <VButton
        variant="ghost"
        size="xs"
        class="text-slate-400 hover:text-red-600! hover:bg-red-50!"
        icon-name="Trash"
        title="'Delete Permanently'"
        @click="emit('action', 'DELETE')"
      />
    </template>

  </VCluster>
</template>

<script setup lang="ts">
import type { EntityActionType } from '@/interfaces/core';

import VCluster from '@/components/atoms/layout/VCluster.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';

/**
 * Available atomic event triggers dispatched directly on single-click streams.
 */

const props = defineProps<{
  status: string | undefined; // Current business pipeline state (AI_EXTRACTED, USER_DRAFT, LOCKED, ON_HOLD)
}>();

const emit = defineEmits<{
  (e: 'action', type: EntityActionType): void;
}>();
</script>