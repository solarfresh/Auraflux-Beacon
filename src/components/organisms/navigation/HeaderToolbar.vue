<template>
  <header class="bg-white/80 backdrop-blur-md sticky top-0 z-50 w-full border-b border-gray-100 shadow-sm">
    <div class="max-w-[1600px] mx-auto px-6 h-16 flex justify-between items-center">

      <div class="flex items-center gap-3 group cursor-pointer">
        <div class="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-200 group-hover:scale-105 transition-transform">
          <VIcon name="Target" size="sm" class="text-white" />
        </div>
        <div class="flex flex-col">
          <VTypography tag="h1" size="lg" weight="black" color="gray-900" class="leading-none tracking-tight">
            Strategic Research ISP
          </VTypography>
          <VTypography tag="span" size="xs" color="gray-400" class="font-bold tracking-widest uppercase mt-0.5">
            Intelligence Platform
          </VTypography>
        </div>
      </div>

      <nav class="hidden lg:flex items-center bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
        <div class="flex items-center gap-2">
          <VBadge
            :variant="currentStep === 'INITIATION' ? 'indigo' : 'gray'"
            size="xs"
            class="transition-all"
          >
            1. Initiation
          </VBadge>
          <VIcon name="ChevronRight" size="xs" class="text-gray-300" />
          <VBadge
            :variant="currentStep === 'EXPLORATION' ? 'indigo' : 'gray'"
            size="xs"
          >
            2. Exploration
          </VBadge>
          <VIcon name="ChevronRight" size="xs" class="text-gray-300" />
          <VBadge
            :variant="currentStep === 'EXPLORATION' ? 'indigo' : 'gray'"
            size="xs"
          >
            3. Synthesis
          </VBadge>
        </div>
      </nav>

      <div class="flex items-center gap-4">
        <div class="h-6 w-[1px] bg-gray-200 mx-2 hidden md:block"></div>

        <AuthButton
          :isLoggedIn="isLoggedIn"
          @login="$emit('login')"
          @logout="$emit('logout')"
        />
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
/**
 * HeaderToolbar.vue
 * The main navigational anchor of the application.
 * Manages branding, global progress visibility, and user session actions.
 */
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBadge from '@/components/atoms/indicators/VBadge.vue';
import AuthButton from '@/components/molecules/actions/AuthButton.vue';
import type { ISPStep } from '@/interfaces/workflow';

// --- Props ---
interface Props {
  /** The current stage of the research workflow. */
  currentStep: ISPStep;
  /** User's authentication status. */
  isLoggedIn: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'login'): void;
  (e: 'logout'): void;
}>();
</script>

<style scoped>
/* Ensure smooth backdrop blur on scroll */
header {
  -webkit-backdrop-filter: blur(8px);
  backdrop-filter: blur(8px);
}
</style>