<template>
  <VBox
    position="relative"
    class="group w-full transition-all duration-300"
    :class="[isFocused ? 'max-w-2xl' : 'max-w-md']"
  >
    <VBox
      position="absolute"
      inset-y="0"
      left="3"
      class="flex items-center pointer-events-none z-10"
    >
      <VIcon
        name="MagnifyingGlass"
        size="sm"
        :color="isFocused ? 'indigo-600' : 'slate-400'"
        class="transition-colors"
      />
    </VBox>

    <VInput
      ref="inputAtom"
      v-model="query"
      variant="search"
      size="md"
      :placeholder="placeholder"
      class="pl-10 pr-16 !bg-slate-100 focus:!bg-white !border-none"
      @focus="isFocused = true"
      @blur="isFocused = false"
      @keyup.enter="handleSearch"
    />

    <VBox
      v-if="!isFocused && !query"
      position="absolute"
      inset-y="0"
      right="4"
      class="hidden md:flex items-center z-10"
    >
      <VCluster gap="xs" class="bg-white border border-slate-200 px-1.5 py-0.5 rounded-md shadow-sm">
        <VTypography tag="span" size="xs" weight="bold" color="slate-400">⌘</VTypography>
        <VTypography tag="span" size="xs" weight="bold" color="slate-400">K</VTypography>
      </VCluster>
    </VBox>

    <VBox
      v-if="query"
      position="absolute"
      inset-y="0"
      right="2"
      class="flex items-center z-10"
    >
      <VButton
        variant="ghost"
        size="xs"
        icon-name="XMark"
        icon-only
        @click="query = ''"
      />
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VInput from '@/components/atoms/forms/VInput.vue';

withDefaults(defineProps<{
  placeholder?: string;
}>(), {
  placeholder: 'Search projects or nodes...'
});

const emit = defineEmits<{
  (e: 'search', query: string): void;
}>();

const query = ref('');
const isFocused = ref(false);
const inputAtom = ref<any>(null);

// --- Keyboard Shortcut Logic ---
const handleKeyDown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault();
    // VInput exposes the native input ref via $el or a ref
    inputAtom.value?.$el?.focus();
  }
};

onMounted(() => window.addEventListener('keydown', handleKeyDown));
onUnmounted(() => window.removeEventListener('keydown', handleKeyDown));

const handleSearch = () => {
  if (query.value.trim()) {
    emit('search', query.value.trim());
  }
};
</script>