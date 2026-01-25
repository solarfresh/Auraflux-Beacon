<template>
  <Box
    tag="aside"
    background="white"
    border="right"
    class="flex flex-col h-full overflow-hidden transition-all duration-200"
  >
    <Box
      v-if="$slots.header || title"
      tag="header"
      padding="sidebar-header"
      border="bottom"
      class="flex-shrink-0 z-10 sticky top-0 bg-white/80 backdrop-blur-md"
    >
      <slot name="header">
        <Cluster justify="between" align="center" full-width>
          <Cluster gap="sm" align="baseline" class="min-w-0">
            <VTypography tag="h2" size="xl" weight="bold" color="gray-900" truncate>
              {{ title }}
            </VTypography>
            <VTypography v-if="itemCount !== undefined" tag="span" size="sm" weight="medium" color="gray-400">
              ({{ itemCount }})
            </VTypography>
          </Cluster>
          <Cluster gap="xs">
            <slot name="header-actions" />
          </Cluster>
        </Cluster>
      </slot>
      <slot name="header-extension" />
    </Box>

    <Box
      tag="div"
      class="flex-1 overflow-y-auto overflow-x-hidden transition-all"
      :class="{ 'stable-gutter': useStableGutter }"
    >
      <slot v-if="!isEmpty" name="body" />

      <Stack
        v-else
        full-height
        align="center"
        justify="center"
        gap="md"
        class="p-8 text-center"
      >
        <slot name="empty-state" />
      </Stack>
    </Box>

    <Box
      v-if="$slots.footer"
      tag="footer"
      padding="md"
      background="gray-50"
      border="top"
      class="mt-auto"
    >
      <slot name="footer" />
    </Box>
  </Box>
</template>

<script setup lang="ts">
/**
 * BaseSidebarLayout (Organism)
 * A clean structural shell.
 * Removed 'bodyClass' prop to prevent recursive array nesting ['p-2', ['p-2']].
 */
import Box from '@/components/atoms/layout/Box.vue';
import Stack from '@/components/atoms/layout/Stack.vue';
import Cluster from '@/components/atoms/layout/Cluster.vue';
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