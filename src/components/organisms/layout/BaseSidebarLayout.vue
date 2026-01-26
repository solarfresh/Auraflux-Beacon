<template>
  <VBox
    tag="aside"
    background="white"
    border="right"
    class="flex flex-col h-full overflow-hidden transition-all duration-200"
  >
    <VBox
      v-if="$slots.header || title"
      tag="header"
      padding="md"
      border="bottom"
      class="flex-shrink-0 z-10 sticky top-0 bg-white/80 backdrop-blur-md"
    >
      <slot name="header">
        <VCluster justify="between" align="center" full-width>
          <VCluster gap="sm" align="baseline" class="min-w-0">
            <VTypography tag="h2" size="xl" weight="bold" color="gray-900" truncate>
              {{ title }}
            </VTypography>
            <VTypography v-if="itemCount !== undefined" tag="span" size="sm" weight="medium" color="gray-400">
              ({{ itemCount }})
            </VTypography>
          </VCluster>
          <VCluster gap="xs">
            <slot name="header-actions" />
          </VCluster>
        </VCluster>
      </slot>
      <slot name="header-extension" />
    </VBox>

    <VBox
      tag="div"
      class="flex-1 overflow-y-auto overflow-x-hidden transition-all"
      :class="{ 'stable-gutter': useStableGutter }"
    >
      <slot v-if="!isEmpty" name="body" />

      <VStack
        v-else
        full-height
        align="center"
        justify="center"
        gap="md"
        class="p-8 text-center"
      >
        <slot name="empty-state" />
      </VStack>
    </VBox>

    <VBox
      v-if="$slots.footer"
      tag="footer"
      padding="md"
      background="slate-50"
      border="top"
      class="mt-auto"
    >
      <slot name="footer" />
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
/**
 * BaseSidebarLayout (Organism)
 * A clean structural shell.
 * Removed 'bodyClass' prop to prevent recursive array nesting ['p-2', ['p-2']].
 */
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';

interface Props {
  title?: string;
  itemCount?: number;
  isEmpty?: boolean;
  useStableGutter?: boolean;
}

withDefaults(defineProps<Props>(), {
  title: '',
  itemCount: undefined,
  isEmpty: false,
  useStableGutter: true,
});
</script>

<style scoped>
.stable-gutter {
  scrollbar-gutter: stable;
}
/* Industrial scrollbar */
.overflow-y-auto::-webkit-scrollbar {
  width: 5px;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #E5E7EB;
  border-radius: 10px;
}
</style>