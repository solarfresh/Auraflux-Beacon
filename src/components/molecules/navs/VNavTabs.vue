<template>
  <VStack gap="none" class="h-full w-full overflow-hidden">

    <VBox
      tag="nav"
      background="white"
      border="bottom"
      padding="none"
      class="flex-shrink-0"
    >
      <VCluster gap="md" align="center" class="px-4">
        <VButton
          v-for="tab in tabs"
          :key="tab.id"
          variant="ghost"
          size="md"
          :aria-selected="modelValue === tab.id"
          role="tab"
          class="relative rounded-none border-b-2 py-4 px-1 transition-all duration-150"
          :class="[
            modelValue === tab.id
              ? 'border-indigo-600'
              : 'border-transparent'
          ]"
          @click="selectTab(tab.id)"
        >
          <VTypography
            tag="span"
            size="sm"
            :weight="modelValue === tab.id ? 'bold' : 'medium'"
            :class="modelValue === tab.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'"
          >
            <slot :name="`tab-${tab.id}-title`" :tab="tab">{{ tab.label }}</slot>
          </VTypography>
        </VButton>
      </VCluster>
    </VBox>

    <VBox
      tag="section"
      background="transparent"
      class="flex-1 overflow-y-auto relative min-h-0"
      role="tabpanel"
    >
      <div
        v-for="tab in tabs"
        :key="tab.id"
        v-show="modelValue === tab.id"
        class="h-full w-full"
      >
        <slot :name="`tab-${tab.id}-content`" :tab="tab"></slot>
      </div>
    </VBox>
  </VStack>
</template>

<script setup lang="ts">
/**
 * VNavTabs Molecule
 * * Orchestrates navigation between different views.
 * Uses v-model for state synchronization as per Molecule principles.
 */
import VBox from '@/components/atoms/layout/VBox.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VButton from '@/components/atoms/buttons/VButton.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';

interface TabItem {
  id: string | number;
  label: string;
}

const props = defineProps<{
  /** Active Tab ID (Syncs with v-model) */
  modelValue: string | number;
  /** Tab configuration array */
  tabs: TabItem[];
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', id: string | number): void;
  (e: 'change', id: string | number): void;
}>();

const selectTab = (id: string | number) => {
  emit('update:modelValue', id);
  emit('change', id);
};
</script>