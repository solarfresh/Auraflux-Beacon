<template>
  <div class="flex flex-col gap-2">
    <Button
      v-if="collapsible"
      variant="ghost"
      class="w-full !justify-between !px-0 border-b !rounded-none pb-1 group text-left transition-opacity"
      :class="[variantClasses.border, isClosed ? 'opacity-60 hover:opacity-100' : 'opacity-100']"
      @click="toggle"
    >
      <Text
        tag="h4"
        size="xs"
        weight="bold"
        :color="variantClasses.text"
        class="uppercase tracking-wider"
      >
        {{ title }} <span v-if="count !== undefined">({{ count }})</span>
      </Text>

      <Icon
        :name="!isClosed ? 'ChevronUp' : 'ChevronDown'"
        size="xs"
        :color="variantClasses.icon"
      />
    </Button>

    <div
      v-else
      class="flex items-center gap-2 border-b pb-1"
      :class="variantClasses.border"
    >
      <Text
        tag="h4"
        size="xs"
        weight="bold"
        :color="variantClasses.text"
        class="uppercase tracking-wider"
      >
        {{ title }}
      </Text>
    </div>

    <ul v-if="!collapsible || !isClosed" class="flex flex-col gap-1.5">
      <slot></slot>
    </ul>

    <slot v-if="(!collapsible || !isClosed) && $slots.footer" name="footer"></slot>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from '@/components/atoms/actions/Button.vue';
import Icon from '@/components/atoms/Icon.vue';
import Text from '@/components/atoms/Text.vue';

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
      return { border: 'border-gray-200', text: 'gray-500', icon: 'gray-400' };
  }
});
</script>