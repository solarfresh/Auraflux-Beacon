<template>
  <div class="flex flex-col h-full bg-white relative overflow-hidden">
    <div
      ref="chatHistoryRef"
      class="flex-1 overflow-y-auto p-4 sm:p-8 space-y-8 stable-gutter bg-slate-50/30"
    >
      <div
        v-for="message in messages"
        :key="message.id"
        class="flex flex-col animate-in fade-in slide-in-from-bottom-2 duration-300"
        :class="message.role === 'user' ? 'items-end' : 'items-start'"
      >
        <div
          class="flex gap-3 max-w-[85%]"
          :class="message.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
        >
          <div
            class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center shadow-sm"
            :class="message.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-white border border-slate-100 text-amber-500'"
          >
            <VIcon :name="message.role === 'user' ? 'User' : 'Sparkles'" size="xs" />
          </div>

          <div
            class="p-4 rounded-2xl shadow-sm transition-all"
            :class="[
              message.role === 'user'
                ? 'bg-indigo-600 text-white rounded-tr-none'
                : 'bg-white border border-slate-100 text-slate-800 rounded-tl-none'
            ]"
          >
            <template v-if="message.role === 'system'">
              <VMarkdown :content="message.content" class="prose prose-sm max-w-none text-slate-800" />
            </template>

            <template v-else>
              <VTypography tag="p" size="base" color="current" class="leading-relaxed whitespace-pre-wrap">
                {{ message.content }}
              </VTypography>
            </template>
          </div>
        </div>

        <div class="mt-1 px-11">
          <VTypography tag="span" size="xs" color="slate-400" weight="medium">
            {{ message.role === 'user' ? 'Sent' : 'Agent Intelligence' }}
          </VTypography>
        </div>
      </div>

      <div v-if="isTyping" class="flex items-center gap-2 pl-11 animate-pulse">
        <div class="flex gap-1">
          <span class="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
          <span class="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
          <span class="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
        </div>
        <VTypography tag="span" size="xs" color="slate-400">AI is analyzing...</VTypography>
      </div>
    </div>

    <footer class="flex-shrink-0 border-t border-slate-100 p-4 sm:p-6 bg-white/80 backdrop-blur-sm">
      <div class="max-w-4xl mx-auto">
        <VInputGroup
          @send-message="$emit('sendMessage', $event)"
          :is-disabled="isTyping"
          class="shadow-lg shadow-slate-200/50"
        />
        <div class="mt-2 text-center">
          <VTypography tag="p" size="xs" color="slate-400">
            ISP Agent uses advanced heuristics. Please verify critical strategic data.
          </VTypography>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import type { ChatMessage } from '@/interfaces/core';

// Atoms & Molecules
import VMarkdown from '@/components/atoms/indicators/VMarkdown.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VInputGroup from '@/components/molecules/forms/VInputGroup.vue';

const props = defineProps<{
  messages: ChatMessage[];
  isTyping: boolean;
}>();

const emit = defineEmits<{
  (e: 'sendMessage', content: string): void;
}>();

// --- Scroll Logic ---
const chatHistoryRef = ref<HTMLDivElement | null>(null);

/**
 * Automatically scrolls to the bottom of the chat when new messages arrive
 * or when the typing indicator state changes.
 */
const scrollToBottom = async () => {
  await nextTick();
  if (chatHistoryRef.value) {
    chatHistoryRef.value.scrollTo({
      top: chatHistoryRef.value.scrollHeight,
      behavior: 'smooth'
    });
  }
};

watch(() => props.messages.length, scrollToBottom, { immediate: true });
watch(() => props.isTyping, (typing) => { if (typing) scrollToBottom(); });
</script>

<style scoped>
/* Custom prose styles for the AI markdown response */
:deep(.prose) {
  --tw-prose-body: currentColor;
  --tw-prose-headings: currentColor;
}
</style>