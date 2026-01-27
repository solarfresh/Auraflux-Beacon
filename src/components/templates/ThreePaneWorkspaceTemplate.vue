<template>
  <VBox tag="div" background="slate-50" class="flex flex-col h-screen w-full overflow-hidden">

    <VBox
      tag="header"
      background="white"
      padding="sm"
      border="bottom"
      class="flex-shrink-0 z-30"
    >
      <VBox padding="none" class="px-6">
        <slot name="header" />
      </VBox>
    </VBox>

    <main class="flex-1 flex h-full overflow-hidden relative">

      <VBox
        tag="section"
        width="80"
        background="white"
        border="right"
        aria-label="Sidebar Navigation"
        class="flex-shrink-0 w-80 h-full overflow-hidden z-20"
      >
        <slot name="left-sidebar" />
      </VBox>

      <VBox
        tag="section"
        padding="none"
        background="white"
        aria-label="Main Conceptual Canvas"
        class="flex-1 overflow-hidden relative z-10"
      >
        <slot name="main-content" />
      </VBox>

      <VBox
        tag="section"
        background="slate-50"
        border="left"
        class="flex-shrink-0 overflow-hidden z-20"
        :class="[
          'transition-all duration-300 ease-in-out',
          isRightOpen ? 'w-96 border-l border-slate-100' : 'w-0 border-none overflow-hidden'
        ]"
      >
        <slot name="right-panel" />
      </VBox>

      <VFloatControl
        side="right"
        :is-open="isRightOpen"
        offset="384px"
        @toggle="isRightOpen = !isRightOpen"
      />
    </main>

    <VBox
      tag="footer"
      background="white"
      padding="sm"
      border="top"
      class="flex-shrink-0 z-30"
    >
      <VBox padding="none" class="px-6">
        <slot name="footer" />
      </VBox>
    </VBox>

  </VBox>
</template>

<script setup lang="ts">
/**
 * WorkspaceLayout (Template)
 * The master frame for the ISP Exploration environment.
 * Orchestrates high-level z-index management and global layout constraints.
 */
import { ref } from 'vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VFloatControl from '@/components/molecules/layout/VFloatControl.vue';

const isRightOpen = ref(true);
</script>