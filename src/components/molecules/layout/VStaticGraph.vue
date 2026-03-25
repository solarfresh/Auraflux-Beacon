<template>
  <VGraphCanvas viewBox="0 0 1440 900">

    <VGraphGroup colorClass="text-slate-700/40">
      <VGraphEdge :x1="150" :y1="200" :x2="400" :y2="350" />
      <VGraphEdge :x1="400" :y1="350" :x2="650" :y2="250" />
    </VGraphGroup>

    <VGraphGroup colorClass="text-slate-600/30">
      <VGraphEdge :x1="400" :y1="350" :x2="380" :y2="600" :status="'AI_EXTRACTED'" />
    </VGraphGroup>

    <VGraphGroup colorClass="text-slate-500/60">
      <VGraphPoint :x="150" :y="200" />
      <VGraphPoint :x="400" :y="350" :radius="5" />
      <VGraphPoint :x="650" :y="250" />
      <VGraphPoint :x="380" :y="600" />
    </VGraphGroup>

  </VGraphCanvas>
</template>

<script setup lang="ts">
import VGraphCanvas from '@/components/atoms/layout/VGraphCanvas.vue';
import VGraphGroup from '@/components/atoms/layout/VGraphGroup.vue';
import VGraphEdge from '@/components/atoms/canvases/VGraphEdge.vue';
import VGraphPoint from '@/components/atoms/canvases/VGraphPoint.vue';
</script>