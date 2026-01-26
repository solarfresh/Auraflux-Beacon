<template>
  <div class="h-full w-full flex flex-col bg-slate-50">

    <header class="flex-shrink-0 border-b border-gray-200 bg-white">
      <div class="px-6 py-2">
        <slot name="header"></slot>
      </div>
    </header>

    <main class="flex-1 flex overflow-hidden">

      <section
        class="flex-shrink-0 w-80 border-r border-gray-200 overflow-y-auto bg-white"
        aria-label="Sidebar Navigation"
      >
        <slot name="left-sidebar"></slot>
      </section>

      <section
        class="flex-1 overflow-hidden p-0 bg-white"
        aria-label="Main Conceptual Canvas"
      >
        <slot name="main-content"></slot>
      </section>

      <section
        class="flex-shrink-0 w-96 border-l border-gray-200 overflow-hidden bg-slate-50"
        aria-label="Tools and Assistants"
      >
        <div class="h-full flex flex-col">
          <slot name="right-panel"></slot>
        </div>
      </section>

    </main>

    <footer class="flex-shrink-0 border-t border-gray-200 bg-white">
      <div class="px-6 py-2">
        <slot name="footer"></slot>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
</script>