<template>
  <VBox class="v-inspector-panel">
    <VPanelHeader :title="title" :is-expanded="isExpanded" @toggle="toggle" />
    <VBox v-if="isExpanded" class="v-inspector-panel__content">
      <slot />
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VPanelHeader from '@auraflux/design-system/components/molecules/layout/VPanelHeader.vue';

const props = withDefaults(defineProps<{
  isExpanded?: boolean;
  title: string;
}>(), {
  isExpanded: true
});

const emit = defineEmits<{
  (e: 'update:isExpanded', value: boolean): void;
  (e: 'toggle'): void;
}>();

const toggle = () => {
  emit('update:isExpanded', !props.isExpanded);
  emit('toggle');
};
</script>
