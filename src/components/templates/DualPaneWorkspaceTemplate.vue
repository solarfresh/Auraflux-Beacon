<template>
  <div class="h-screen flex flex-col bg-gray-50 antialiased">

    <slot name="status-tracker">
    </slot>

    <main class="flex flex-1 overflow-hidden">

      <div
        class="w-full md:w-1/3 xl:w-1/4 flex-shrink-0 bg-white border-r shadow-lg overflow-y-auto p-4 transition-all duration-300 ease-in-out"
      >
        <slot name="sidebar"></slot>
      </div>

      <div class="flex flex-col flex-1 overflow-hidden">

        <div class="flex-1 overflow-y-auto">
          <slot name="chat-interface"></slot>
        </div>

        <div class="flex-shrink-0 bg-white border-t">
          <slot name="action-bar"></slot>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
// Note: Templates typically have minimal or no logic (scripts),
// focusing purely on defining the structural layout and accepting slots.
</script>

<style scoped>
/* Tailwind utility classes are applied directly in the template for structure. */
/* No custom CSS required for this layout component. */
</style>