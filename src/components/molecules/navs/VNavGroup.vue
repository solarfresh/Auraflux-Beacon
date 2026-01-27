<template>
  <div class="flex flex-col gap-2">
    <VButton
      v-if="collapsible"
      variant="ghost"
      class="w-full !justify-between !px-0 border-b !rounded-none pb-1 group text-left transition-opacity"
      :class="[variantClasses.border, isClosed ? 'opacity-60 hover:opacity-100' : 'opacity-100']"
      @click="toggle"
    >
      <VTypography
        tag="h4"
        size="xs"
        weight="bold"
        :color="variantClasses.text"
        class="uppercase tracking-wider"
      >
        {{ title }} <span v-if="count !== undefined">({{ count }})</span>
      </VTypography>

      <VIcon
        :name="!isClosed ? 'ChevronUp' : 'ChevronDown'"
        size="xs"
        :color="variantClasses.icon"
      />
    </VButton>

    <div
      v-else
      class="flex items-center gap-2 border-b pb-1"
      :class="variantClasses.border"
    >
      <VTypography
        tag="h4"
        size="xs"
        weight="bold"
        :color="variantClasses.text"
        class="uppercase tracking-wider"
      >
        {{ title }}
      </VTypography>
    </div>

    <ul v-if="!collapsible || !isClosed" class="flex flex-col gap-1.5">
      <slot></slot>
    </ul>

    <slot v-if="(!collapsible || !isClosed) && $slots.footer" name="footer"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';

interface Props {
  title: string;
  count?: number;
  variant?: 'indigo' | 'amber' | 'gray';
  collapsible?: boolean;
  defaultClosed?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'gray',
  collapsible: false,
  defaultClosed: false,
});

const isClosed = ref(props.defaultClosed);
const toggle = () => (isClosed.value = !isClosed.value);

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'indigo':
      return { border: 'border-indigo-100', text: 'indigo-600', icon: 'indigo-400' };
    case 'amber':
      return { border: 'border-amber-100', text: 'amber-700', icon: 'amber-400' };
    default:
      return { border: 'border-slate-200', text: 'slate-500', icon: 'slate-400' };
  }
});
</script>