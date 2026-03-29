<template>
  <VBox
    class="relative group transition-all duration-300 ease-in-out w-full"
    :class="[isFocused ? 'max-w-2xl' : 'max-w-md']"
  >
    <VBox
      class="absolute inset-y-0 left-0 flex items-center pl-3.5 z-10 pointer-events-none"
    >
      <VIcon
        name="MagnifyingGlass"
        size="sm"
        :color="isFocused ? 'indigo-600' : 'slate-400'"
      />
    </VBox>

    <VInput
      ref="inputAtom"
      v-model="query"
      variant="search"
      size="md"
      :placeholder="placeholder"
      class="w-full pl-10 pr-16 bg-slate-100! focus:bg-white! border-none!"
      @focus="isFocused = true"
      @blur="isFocused = false"
    />

    <VBox
      class="absolute inset-y-0 right-0 flex items-center pr-2 z-10"
    >
      <VCluster
        v-if="!isFocused && !query"
        gap="xs"
        class="hidden md:flex bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-sm"
      >
        <VTypography tag="span" size="xs" weight="bold" color="slate-400">⌘</VTypography>
        <VTypography tag="span" size="xs" weight="bold" color="slate-400">K</VTypography>
      </VCluster>

      <VButton
        v-if="query"
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