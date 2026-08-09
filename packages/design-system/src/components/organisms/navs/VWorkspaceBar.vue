<template>
  <VCluster
    gap="xs"
    align="center"
    class="bg-white border border-slate-200 rounded-full px-1 py-1 shadow-sm"
  >
    <VButton
      attention="tertiary"
      :intent="intent"
      size="sm"
      icon-name="ChevronLeft"
      icon-only
      :disabled="disabled"
      @click="emit('prev')"
    />

    <VBox
      class="relative"
    >
      <VButton
        attention="secondary"
        :intent="intent"
        size="sm"
        class="min-w-md"
        icon-name="ChevronDown"
        :disabled="disabled"
      >
        {{ activeTool?.label }}
      </VButton>

      <VDropdownMenu
        v-if="showMenu"
        :intent="intent"
        class="absolute top-full left-0 mt-1 shadow-lg z-50 min-w-full"
      >
        <VDropdownItem
          v-for="tool in tools"
          :key="tool.id"
          :intent="intent"
          :icon-name="tool.iconName"
          @click="emit('select', tool);"
        >
          {{ tool.label }}
        </VDropdownItem>
      </VDropdownMenu>
    </VBox>

    <VButton
      attention="tertiary"
      :intent="intent"
      size="sm"
      icon-name="ChevronRight"
      icon-only
      :disabled="disabled"
      @click="emit('next')"
    />
  </VCluster>
</template>

<script setup lang="ts">
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VDropdownMenu from '@auraflux/design-system/components/molecules/layout/VDropdownMenu.vue';
import VDropdownItem from '@auraflux/design-system/components/atoms/buttons/VDropdownItem.vue';
import type { IntentToken } from '@auraflux/design-system/interfaces/theme';
import type { LinkItem } from '@auraflux/design-system/interfaces/navs';

export interface VWorkspaceBarProps {
  tools: LinkItem[];
  activeTool?: LinkItem;
  intent?: IntentToken;
  disabled?: boolean;
  showMenu: boolean;
}

const props = withDefaults(defineProps<VWorkspaceBarProps>(), {
  intent: 'brand',
  disabled: false,
  showMenu: false
});

const emit = defineEmits<{
  (e: 'select', tool: LinkItem): void;
  (e: 'prev'): void;
  (e: 'next'): void;
}>();
</script>