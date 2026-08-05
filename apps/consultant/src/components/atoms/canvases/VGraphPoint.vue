<template>
  <circle
    :cx="x" :cy="y"
    :r="radius"
    class="v-graph-point fill-current transition-transform duration-300"
  />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  x: number | string;
  y: number | string;
  radius?: number;
}>(), {
  radius: 4
});
</script>