<template>
  <component
    :is="tag"
    :class="[
      // 1. Base Atomic Styles
      'box-border',
      paddingClasses[padding],
      backgroundClasses[background],
      borderClasses[border],
      shadow && shadowClasses[shadow],
      rounded && 'rounded-md',
      roundedFull && 'rounded-full',

      // 2. Behavioral Classes
      {
        'overflow-hidden': clip,
        'cursor-pointer': clickable
      },

      // 3. External Class Injection
      // By placing $attrs.class last, we allow external styles
      // to potentially override base styles if necessary.
      $attrs.class
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
/**
 * Box Atom
 * The primary structural container for the design system.
 * Handles padding, backgrounds, and borders using tokens.
 * * NOTE: This component uses fallthrough attributes ($attrs)
 * to automatically merge external classes with internal tokens.
 */

// Disable attribute inheritance on the root if you want precise control,
// but here we leverage it for seamless class merging.
defineOptions({
  inheritAttrs: false
});

type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'sidebar-header';
type Color = 'transparent' | 'white' | 'gray-50' | 'gray-100' | 'indigo-50';
type Border = 'none' | 'all' | 'bottom' | 'right' | 'top';
type Shadow = 'sm' | 'md' | 'lg';

interface Props {
  /** Semantic HTML tag */
  tag?: string;
  /** Internal padding token */
  padding?: Spacing;
  /** Background color token */
  background?: Color;
  /** Border configuration */
  border?: Border;
  /** Shadow elevation */
  shadow?: Shadow;
  /** Standard corner radius (6px/md) */
  rounded?: boolean;
  /** Pill-shaped radius */
  roundedFull?: boolean;
  /** Overflow clipping */
  clip?: boolean;
  /** Pointer cursor affordance */
  clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  padding: 'none',
  background: 'transparent',
  border: 'none',
  shadow: undefined,
  rounded: false,
  roundedFull: false,
  clip: false,
  clickable: false,
});

const paddingClasses: Record<Spacing, string> = {
  none: 'p-0',
  xs: 'p-2',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
  'sidebar-header': 'pt-6 pb-4 px-5',
};

const backgroundClasses: Record<Color, string> = {
  transparent: 'bg-transparent',
  white: 'bg-white',
  'gray-50': 'bg-gray-50',
  'gray-100': 'bg-gray-100',
  'indigo-50': 'bg-indigo-50',
};

const borderClasses: Record<Border, string> = {
  none: '',
  all: 'border border-gray-200',
  bottom: 'border-b border-gray-100',
  right: 'border-r border-gray-200',
  top: 'border-t border-gray-100',
};

const shadowClasses: Record<Shadow, string> = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};
</script>