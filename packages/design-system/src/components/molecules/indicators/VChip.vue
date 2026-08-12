<template>
  <VBox
    :inline="true"
    :padding="padding"
    :rounded="rounded"
    :border="border"
    :attention="attention"
    :intent="intent"
    :surface="surface"
    class="group transition-all duration-200 items-center"
  >
    <VIcon
      v-if="iconName"
      :name="iconName"
      :size="size === 'lg' ? 'md' : 'sm'"
      :class="[iconClass, 'mr-2 shrink-0']"
    />

    <VTypography
      tag="span"
      weight="medium"
      :size="size"
      :class="{ 'mr-2': removable }"
    >
      <slot>{{ label }}</slot>
    </VTypography>

    <VButton
      v-if="removable"
      variant="danger"
      size="xs"
      icon-name="XMark"
      icon-only
      class="opacity-60 group-hover:opacity-100 transition-opacity ml-1"
      @click.stop="$emit('remove')"
    />
  </VBox>
</template>

<script setup lang="ts">
/**
 * VChip Molecule
 * A standardized tag/chip for Keywords, Concepts, or Entities.
 */
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import type {
  SpacingToken,
  RoundedToken,
  BorderToken,
  ComponentSizeToken,
  AttentionToken,
  IntentToken,
  SurfaceToken
} from '@auraflux/design-system/interfaces/theme';

export interface VChipProps {
  label?: string;
  iconName?: string;
  iconClass?: string;
  removable?: boolean;
  padding?: SpacingToken;
  rounded?: RoundedToken;
  border?: BorderToken;
  attention?: AttentionToken;
  intent?: IntentToken;
  surface?: SurfaceToken;
  size?: ComponentSizeToken;
}

withDefaults(defineProps<VChipProps>(), {
  padding: 'sm',
  rounded: 'xl',
  border: 'all',
  attention: 'secondary',
  size: 'sm',
});

defineEmits<{
  (e: 'remove'): void;
}>();
</script>
