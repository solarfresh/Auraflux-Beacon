<template>
  <VCluster align="center" gap="xs" :tag="tag">
    <!-- Icon Prefix -->
    <VBox :intent="intent" :surface="surface" border="none">
      <VIcon
        v-if="icon"
        :name="icon"
        :type="iconType"
        :size="size"
        :class="iconClass"
      />
    </VBox>

    <!-- Title & Custom Content Slot -->
    <slot>
      <VTypography
        :tag="titleTag"
        :size="size"
        :weight="weight"
        :intent="intent"
        :surface="surface"
      >
        {{ title }}
      </VTypography>
    </slot>

    <!-- Extra Action / Badge Slot -->
    <slot name="extra" />
  </VCluster>
</template>

<script setup lang="ts">
/**
 * SectionHeader (Molecule)
 * A standardized header layout for sections, combining an optional icon,
 * structured title typography, and slot for additional actions or badges.
 */
import type {
  TagToken,
  ComponentSizeToken,
  FontWeightToken,
  IntentToken,
  SurfaceToken
} from '@auraflux/design-system/interfaces/theme';

import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';

export interface VSectionHeaderProps {
  /** Outer wrapper HTML tag */
  tag?: TagToken;
  /** Section title text */
  title?: string;
  /** HTML tag for the title typography */
  titleTag?: TagToken;
  /** Optional Heroicon name (e.g., 'Sparkles', 'sparkles', 'Folder') */
  icon?: string;
  /** Heroicon style variant */
  iconType?: 'solid' | 'outline';
  /** Size token propagated to both icon and typography */
  size?: ComponentSizeToken;
  /** Font weight token for the title */
  weight?: FontWeightToken;
  /** Semantic intent token for text/icon color */
  intent?: IntentToken;
  surface?: SurfaceToken;
  /** Custom CSS classes for icon color override */
  iconClass?: string;
}

withDefaults(defineProps<VSectionHeaderProps>(), {
  tag: 'div',
  title: '',
  titleTag: 'h3',
  icon: undefined,
  iconType: 'solid',
  size: 'md',
  weight: 'bold',
  intent: undefined,
  surface: undefined,
  iconClass: undefined,
});
</script>