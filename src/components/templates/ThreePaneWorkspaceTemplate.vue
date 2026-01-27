<template>
  <VBox tag="div" height="screen" width="full" background="slate-50" class="flex flex-col overflow-hidden">

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

    <main class="flex-1 flex overflow-hidden relative">

      <VBox
        tag="section"
        width="80"
        background="white"
        border="right"
        aria-label="Sidebar Navigation"
        class="flex-shrink-0 overflow-y-auto z-20"
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
        width="96"
        background="slate-50"
        border="left"
        aria-label="Tools and Assistants"
        class="flex-shrink-0 overflow-hidden z-20"
      >
        <VStack full-height gap="none">
          <slot name="right-panel" />
        </VStack>
      </VBox>

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
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
</script>