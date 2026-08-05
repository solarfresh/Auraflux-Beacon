<template>
  <div class="prose-ul:list-disc prose-ul:px-4 prose-p:py-2">
      <div v-html="renderedHtml"></div>
  </div>
</template>

<script setup lang="ts">
import MarkdownIt from 'markdown-it';
import { computed } from 'vue';

// --- Configuration and Initialization (Executed only once) ---
const md = new MarkdownIt({
  html: true, // Enables HTML tags in source
  breaks: true, // Converts '\n' to '<br>' in paragraphs
  linkify: true, // Auto-converts bare URLs to links
});

// --- Props ---
const props = defineProps({
  /** The raw Markdown content to be rendered. */
  content: {
    type: String,
    default: ''
  },
  // Optional prop for dynamic config, if needed later
  // options: {
  //   type: Object,
  //   default: () => ({})
  // }
});

// --- Core Logic: Reactive Transformation using computed ---
const renderedHtml = computed<string>(() => {
  if (!props.content) {
    return '';
  }

  // NOTE: Apply any advanced markdown-it configuration (like plugins) here
  // before rendering if configuration depends on props.

  try {
    return md.render(props.content);
  } catch (error) {
    console.error("Markdown rendering failed:", error);
    return `<p class="text-red-500">Error rendering content.</p>`;
  }
});
</script>

<style scoped>
</style>