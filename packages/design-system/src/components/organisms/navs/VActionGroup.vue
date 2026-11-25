<template>
  <VCluster class="v-action-group" :class="{ 'is-disabled': disabled }">
    <template v-for="action in visibleActions" :key="action.id">
      <VTooltip v-if="action.tooltip" :content="action.tooltip">
        <VButton
          :intent="intent"
          :surface="surface"
          :disabled="disabled || action.disabled"
          @click="handleAction(action)"
        >
          <template #icon>
            <VIcon :name="action.iconName" />
          </template>
          {{ action.label }}
        </VButton>
      </VTooltip>
      <VButton
        v-else
        :intent="intent"
        :surface="surface"
        :disabled="disabled || action.disabled"
        @click="handleAction(action)"
      >
        <template #icon>
          <VIcon :name="action.iconName" />
        </template>
        {{ action.label }}
      </VButton>
    </template>
    <VDropdownMenu
      v-if="overflowActions.length > 0"
      v-model="isOpen"
      :intent="intent"
      :surface="surface"
    >
      <template #trigger>
        <VButton
          :intent="intent"
          :surface="surface"
        >...</VButton>
      </template>
      <VDropdownItem
        v-for="action in overflowActions"
        :key="action.id"
        :disabled="disabled || action.disabled"
        @click="handleAction(action)"
      >
        <VTooltip v-if="action.tooltip" :content="action.tooltip">
          <VCluster>
            <VIcon :name="action.iconName" />
            {{ action.label }}
          </VCluster>
        </VTooltip>
        <template v-else>
          <VIcon :name="action.iconName" />
          {{ action.label }}
        </template>
      </VDropdownItem>
    </VDropdownMenu>
  </VCluster>
</template>

<script setup lang="ts">
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VDropdownItem from '@auraflux/design-system/components/atoms/buttons/VDropdownItem.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VDropdownMenu from '@auraflux/design-system/components/molecules/layout/VDropdownMenu.vue';
import VTooltip from '@auraflux/design-system/components/molecules/indicators/VTooltip.vue';
import type { ActionDefinition } from '@auraflux/design-system/interfaces/navs';
import type { IntentToken, SurfaceToken } from '@auraflux/design-system/interfaces/theme';
import { computed, ref } from 'vue';

interface Props {
  actions: ActionDefinition[];
  maxVisible?: number;
  intent?: IntentToken;
  surface?: SurfaceToken;
  disabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  maxVisible: 3,
  disabled: false,
});

const emit = defineEmits<{
  (e: 'action', actionId: string): void;
}>();

const isOpen = ref(false);

const visibleActions = computed(() => {
  const limit = Math.max(0, props.maxVisible);
  if (props.actions.length <= limit) {
    return props.actions;
  }
  return props.actions.slice(0, Math.max(0, limit - 1));
});

const overflowActions = computed(() => {
  const limit = Math.max(0, props.maxVisible);
  if (props.actions.length <= limit) {
    return [];
  }
  return props.actions.slice(Math.max(0, limit - 1));
});

const handleAction = (action: ActionDefinition) => {
  if (props.disabled || action.disabled) return;
  if (action.onClick) action.onClick();
  emit('action', action.id);
  isOpen.value = false;
};
</script>

<style scoped>
.is-disabled {
  opacity: 0.5;
  pointer-events: none;
}
</style>
