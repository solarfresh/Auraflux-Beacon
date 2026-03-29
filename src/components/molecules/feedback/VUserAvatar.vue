<template>
  <VBox
    position="relative"
    :width="sizeClasses[size]"
    :height="sizeClasses[size]"
    class="shrink-0"
  >
    <VBox
      :background="src ? 'transparent' : 'indigo-50'"
      :rounded="'full'"
      :border="border === 'light' ? 'all' : 'none'"
      class="w-full h-full flex items-center justify-center overflow-hidden transition-all"
      :class="[
        border === 'light' ? 'border-slate-200' : '',
        src ? '' : 'select-none'
      ]"
    >
      <img
        v-if="src && !imageError"
        :src="src"
        :alt="name || 'User Avatar'"
        class="w-full h-full object-cover"
        @error="handleImageError"
      />

      <VIcon
        v-else
        name="User"
        type="solid"
        :size="size"
        color="slate-400"
      />
    </VBox>

    <VBox
      v-if="status !== 'none'"
      position="absolute"
      bottom="0"
      right="0"
      width="3"
      height="3"
      :background="statusColorClasses[status] as BackgroundToken"
      rounded="full"
      class="border-2 border-white"
    />
  </VBox>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import type { BackgroundToken } from '@/interfaces/layout';

const props = withDefaults(defineProps<{
  /** The URL of the user's avatar image. */
  src?: string | null;
  /** The user's name, used to generate initials if 'src' is missing. */
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** 'none' to hide the indicator; 'light' for a simple border (useful for lists). */
  border?: 'none' | 'light';
  /** The user's system status. */
  status?: 'online' | 'busy' | 'offline' | 'none';
}>(), {
  size: 'md',
  border: 'none',
  status: 'none'
});

// --- Image Handling ---
const imageError = ref(false);
const handleImageError = () => { imageError.value = true; };

// --- Initials Generation Logic ---
const userInitials = computed(() => {
  if (!props.name || props.name.trim() === '') return '?';
  const parts = props.name.trim().split(' ');
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  // Returns first initial + last initial (e.g., "Scott Huang" -> "SH")
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
});

// --- Style Maps (Consuming Design Tokens) ---
const sizeClasses = {
  xs: '6', // 24px
  sm: '8', // 32px (Header Standard)
  md: '10', // 40px
  lg: '12' // 48px
};

const statusColorClasses = {
  online: 'teal-50',
  busy: 'rose-50',
  offline: 'slate-50',
  none: 'transparent'
};
</script>