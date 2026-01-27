<template>
  <VBox tag="section" background="white" class="flex flex-col h-full w-full overflow-hidden">

    <VBox v-if="$slots.header" border="bottom" padding="sm" background="white" class="flex-shrink-0 z-10">
      <slot name="header" />
    </VBox>

    <VBox
      ref="chatHistoryRef"
      background="slate-50"
      padding="md"
      class="flex-1 overflow-y-auto stable-gutter"
    >
      <VStack gap="md" class="max-w-5xl mx-auto">
        <div
          v-for="message in messages"
          :key="message.id"
          class="animate-in fade-in slide-in-from-bottom-2 duration-300"
        >
          <VStack gap="xs" :align="message.role === 'user' ? 'end' : 'start'">

            <VCluster
              gap="sm"
              align="start"
              class="max-w-[90%] md:max-w-[80%]"
              :class="message.role === 'user' ? 'flex-row-reverse' : 'flex-row'"
            >
              <VBox
                width="8"
                height="8"
                rounded="full"
                class="flex-shrink-0 flex items-center justify-center shadow-sm"
                :background="message.role === 'user' ? 'indigo-50' : 'white'"
                :class="message.role === 'user' ? 'text-indigo-600' : 'text-amber-500 border border-slate-100'"
              >
                <VIcon :name="message.role === 'user' ? 'User' : 'Sparkles'" size="xs" />
              </VBox>

              <VBox
                padding="md"
                rounded="xl"
                class="shadow-sm"
                :background="message.role === 'user' ? 'indigo-50' : 'white'"
                :border="message.role === 'user' ? 'none' : 'all'"
                :class="[
                  message.role === 'user' ? 'text-indigo-900 rounded-tr-none' : 'text-slate-800 rounded-tl-none border-slate-100'
                ]"
              >
                <VMarkdown v-if="message.role === 'system'" :content="message.content" />
                <VTypography v-else tag="p" size="base" color="current" class="leading-relaxed whitespace-pre-wrap">
                  {{ message.content }}
                </VTypography>
              </VBox>
            </VCluster>

            <VBox padding="none" background="transparent" class="px-11">
              <VTypography tag="span" size="xs" color="slate-400" weight="medium">
                {{ message.role === 'user' ? 'Sent' : 'Agent Intelligence' }}
              </VTypography>
            </VBox>
          </VStack>
        </div>

        <VBox v-if="isTyping" padding="none" background="transparent" class="pl-11">
          <VCluster gap="xs" align="center" class="animate-pulse">
            <VCluster gap="none" class="gap-[4px]">
              <span class="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
              <span class="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
              <span class="w-1.5 h-1.5 bg-slate-300 rounded-full"></span>
            </VCluster>
            <VTypography tag="span" size="xs" color="slate-400">AI is analyzing...</VTypography>
          </VCluster>
        </VBox>
      </VStack>
    </VBox>

    <VBox
      background="white"
      padding="lg"
      border="top"
      class="flex-shrink-0 border-slate-100"
    >
      <VStack gap="sm" class="max-w-4xl mx-auto w-full">
        <VInputGroup
          @send-message="$emit('sendMessage', $event)"
          :is-disabled="isTyping"
          class="shadow-lg shadow-slate-200/50"
        />
        <VTypography tag="p" size="xs" color="slate-400" class="text-center">
          ISP Agent uses advanced heuristics. Please verify critical strategic data.
        </VTypography>
      </VStack>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';
import type { ChatMessage } from '@/interfaces/core';

// Atoms & Molecules
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
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
const chatHistoryRef = ref<InstanceType<typeof VBox> | null>(null);

/**
 * Automatically scrolls to the bottom of the chat when new messages arrive
 * or when the typing indicator state changes.
 */
const scrollToBottom = async () => {
  await nextTick();
  if (chatHistoryRef.value) {
    chatHistoryRef.value?.$el.scrollTo({
      top: chatHistoryRef.value?.$el.scrollHeight,
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