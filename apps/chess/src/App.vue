<template>
  <RouterView />
</template>

<script setup lang="ts">
import { useWebSocketConnection } from '@auraflux/shared-core/composables/useWebSocketConnection';
import config from '@auraflux/shared-core/config';

useWebSocketConnection(config.AURAFLUX_WS_URL);
</script>
