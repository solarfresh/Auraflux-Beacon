<template>
  <VBox :padding="padding" class="v-panel-header-wrapper">
    <VCluster class="v-panel-header" align="center" justify="between">
      <VTypography tag="h3" weight="semibold" class="v-panel-title">
        {{ title }}
      </VTypography>
      <VButton
        variant="ghost"
        size="sm"
        @click.stop="$emit('toggle')"
        :aria-expanded="isExpanded"
        :icon-name="isExpanded ? 'ChevronUp' : 'ChevronDown'"
        icon-only
      />
    </VCluster>
  </VBox>
</template>

<script setup lang="ts">
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue'
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue'
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue'
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue'
import type { SpacingToken } from '@auraflux/design-system/interfaces/theme'

withDefaults(defineProps<{
  title: string
  isExpanded: boolean
  padding?: SpacingToken
}>(), {
  padding: 'md'
})

defineEmits<{
  (e: 'toggle'): void
}>()
</script>

<style scoped>
.v-panel-title {
  margin: 0;
}
</style>
