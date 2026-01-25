<template>
  <component
    :is="tag"
    :class="[
      // 1. Spacing
      padding && paddingMap[padding],

      // 2. Shape & Border
      roundedClass,
      border && borderMap[border],

      // 3. Color & Interaction
      background && backgroundMap[background],
      { 'cursor-pointer select-none active:opacity-80 transition-opacity': clickable },

      // 4. Custom overrides from parent
      $attrs.class
    ]"
    v-bind="filteredAttrs"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
/**
 * Box Atom (The "Skin" layer)
 * A foundational container that manages padding, borders, and backgrounds.
 * It strictly adheres to Design Tokens to prevent "Magic Values".
 */
import { computed, useAttrs } from 'vue';

type SpacingToken = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type RoundedToken = boolean | 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
type BorderToken = 'all' | 'top' | 'bottom' | 'right' | 'none';
type BackgroundToken = 'white' | 'gray-50' | 'indigo-50' | 'amber-50' | 'rose-50' | 'emerald-50' | 'transparent';

interface Props {
  /** HTML tag to render */
  tag?: string;
  /** Internal spacing token */
  padding?: SpacingToken;
  /** Radius token. If true, uses 'md' (8px) as default */
  rounded?: RoundedToken;
  /** Border position token */
  border?: BorderToken;
  /** Semantic background token */
  background?: BackgroundToken;
  /** Adds pointer cursor and active state */
  clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  padding: 'none',
  rounded: false,
  border: 'none',
  background: 'transparent',
  clickable: false
});

// --- Token Mapping ---

const paddingMap: Record<SpacingToken, string> = {
  none: 'p-0',
  xs: 'p-2',   // 8px
  sm: 'p-3',   // 12px
  md: 'p-4',   // 16px
  lg: 'p-6',   // 24px
  xl: 'p-8'    // 32px
};

const borderMap: Record<BorderToken, string> = {
  all: 'border border-gray-100',
  top: 'border-t border-gray-100',
  bottom: 'border-b border-gray-100',
  right: 'border-r border-gray-100',
  none: 'border-none'
};

const backgroundMap: Record<BackgroundToken, string> = {
  white: 'bg-white',
  'gray-50': 'bg-gray-50',
  'indigo-50': 'bg-indigo-50',
  'amber-50': 'bg-amber-50',
  'rose-50': 'bg-rose-50',
  'emerald-50': 'bg-emerald-50',
  transparent: 'bg-transparent'
};

// --- Computed Logic ---

/**
 * Resolves the rounding class based on boolean or token input.
 * Fixed the type issue where rounded="xl" was previously invalid.
 */
const roundedClass = computed(() => {
  if (props.rounded === true) return 'rounded-md';
  if (props.rounded === false || props.rounded === 'none') return 'rounded-none';
  return `rounded-${props.rounded}`;
});

/**
 * Ensure attributes (like @click) are passed down correctly
 * while we manually handle 'class'.
 */
const attrs = useAttrs();
const filteredAttrs = computed(() => {
  const { class: _, ...rest } = attrs;
  return rest;
});
</script>