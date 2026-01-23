<template>
  <Button
    variant="ghost"
    size="sm"
    iconOnly
    :iconName="'XMark'"
    :aria-label="ariaLabel"
    class="rounded-full"
    @click="$emit('click')"
  />
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';

/**
 * CloseButton Molecule
 * A standardized trigger for dismissing modals, alerts, or panels.
 * It wraps the Button atom with specific defaults for the 'Close' action.
 */
defineProps({
  /** Accessible label for screen readers */
  ariaLabel: {
    type: String,
    default: 'Close',
  },
});

defineEmits<{
  (e: 'click'): void;
}>();
</script>