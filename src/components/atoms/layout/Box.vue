<template>
  <component
    :is="tag"
    :class="[
      // Base styles
      'box-border',

      // Padding tokens
      paddingClasses[padding],

      // Background colors
      backgroundClasses[background],

      // Border tokens
      borderClasses[border],

      // Shadow tokens
      shadow && shadowClasses[shadow],

      // Border Radius
      rounded && 'rounded-md',
      roundedFull && 'rounded-full',

      // Accessibility & Layout
      {
        'overflow-hidden': clip,
        'cursor-pointer': clickable
      }
    ]"
  >
    <slot />
  </component>
</template>

<script setup lang="ts">
/**
 * Box Atom
 * The fundamental container component. Handles padding, borders,
 * and backgrounds using standardized design tokens.
 */

type Spacing = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'sidebar-header';
type Color = 'transparent' | 'white' | 'gray-50' | 'gray-100' | 'indigo-50';
type Border = 'none' | 'all' | 'bottom' | 'right';
type Shadow = 'sm' | 'md' | 'lg';

interface Props {
  /** The HTML tag to render for semantic correctness */
  tag?: string;
  /** Internal spacing */
  padding?: Spacing;
  /** Background color token */
  background?: Color;
  /** Border configuration */
  border?: Border;
  /** Elevation shadow */
  shadow?: Shadow;
  /** Whether to apply standard rounded corners */
  rounded?: boolean;
  /** Whether to apply pill-style corners */
  roundedFull?: boolean;
  /** Whether to hide overflow content */
  clip?: boolean;
  /** Visual affordance for interactivity */
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

// Mapping props to Tailwind utility classes
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
};

const shadowClasses: Record<Shadow, string> = {
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
};
</script>