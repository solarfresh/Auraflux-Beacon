<template>
  <Button variant="primary" size="md" v-bind="$attrs" icon-only>
    <Icon name="magnifying-glass" type="solid" size="md" color="white" />
  </Button>
</template>

<script setup lang="ts">
import Button from '@/components/atoms/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
</script>