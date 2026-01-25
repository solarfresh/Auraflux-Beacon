<template>
  <aside
    class="flex flex-col overflow-hidden transition-all duration-200"
    :class="$attrs.class"
  >
    <header
      v-if="$slots.header || title"
      class="flex-shrink-0 z-10 sticky top-0"
    >
      <slot name="header">
        <div class="pt-6 pb-4 px-5">
          <div class="flex items-center justify-between">
            <div class="flex items-baseline gap-2">
              <Text tag="h2" size="xl" weight="bold" color="gray-900">
                {{ title }}
              </Text>
              <Text
                v-if="itemCount !== undefined"
                tag="span"
                size="sm"
                weight="medium"
                color="gray-400"
              >
                ({{ itemCount }})
              </Text>
            </div>
            <slot name="header-actions" />
          </div>
        </div>
      </slot>

      <slot name="header-extension" />
    </header>

    <div
      class="flex-1 overflow-y-auto overflow-x-hidden transition-all"
      :class="[
        bodyClass,
        { 'stable-gutter': useStableGutter }
      ]"
    >
      <slot name="body" />

      <div v-if="isEmpty" class="flex flex-col items-center justify-center">
        <slot name="empty-state" />
      </div>
    </div>

    <footer v-if="$slots.footer" class="flex-shrink-0 mt-auto">
      <slot name="footer" />
    </footer>
  </aside>
</template>

<script setup lang="ts">
import Text from '@/components/atoms/data-display/Text.vue';

/**
 * BaseSidebarLayout: A presentational "shell" component.
 * It handles the vertical stacking of Header, Body, and Footer
 * while remaining agnostic to business logic and specific visual themes.
 */
withDefaults(defineProps<{
  /** The main title shown in the default header */
  title?: string;
  /** Numerical badge shown next to title */
  itemCount?: number;
  /** Controls visibility of the empty state slot */
  isEmpty?: boolean;
  /** CSS classes to be applied specifically to the scrollable body container */
  bodyClass?: string;
  /** Whether to reserve space for the scrollbar to prevent layout shift */
  useStableGutter?: boolean;
}>(), {
  title: '',
  itemCount: undefined,
  isEmpty: false,
  bodyClass: '',
  useStableGutter: true,
});
</script>

<style scoped>
/**
 * Utility to prevent Layout Shift (Jank) when scrollbars appear.
 * Relies on the global CSS scrollbar-gutter configuration.
 */
.stable-gutter {
  scrollbar-gutter: stable;
}
</style>