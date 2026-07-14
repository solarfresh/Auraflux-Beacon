<template>
  <VBox
    @wheel.stop
    background="white"
    rounded="xl"
    border="all"
    padding="md"
    class="shadow-xl animate-in fade-in zoom-in duration-200"
  >
    <VStack gap="md" class="max-h-[85vh] overflow-hidden">

      <VCluster justify="between" align="center" class="w-full">
        <VCluster gap="xs" align="center">
          <VIcon :name="nodeTypeIcon" class="text-indigo-600 size-4" />
          <VTypography weight="bold" size="sm" color="slate-900">
            {{ isNew ? 'Create Node' : 'Edit' }} ({{ localNode.type }})
          </VTypography>
        </VCluster>
        <VButton variant="ghost" size="xs" icon-only icon-name="XMark" @click="emit('cancel')" />
      </VCluster>

      <VBox border="bottom" class="h-0 w-full shrink-0" />

      <VStack gap="sm" class="w-full overflow-y-auto pr-2 custom-scrollbar">
        <VFormField id="node-type" label="Node Type">
          <VSelect
            v-model="localNode.type"
            id="node-type"
            size="sm"
          >
            <option v-for="type in availableNodeTypes" :key="type" :value="type">
              {{ type }}
            </option>
          </VSelect>
        </VFormField>
        <VFormField id="label" label="Concept Label" :required="true">
          <VInput v-model="localNode.label" size="sm" />
        </VFormField>

        <VFormField id="content" label="Detailed Content">
          <VTextarea v-model="localNode.content" :rows="3" />
        </VFormField>

        <VFormField id="rationale" label="AI Reasoning / Rationale">
          <VBox background="slate-50" rounded="md" padding="sm" border="all" class="text-xs text-slate-600 italic">
            {{ localNode.rationale || 'No AI reasoning available.' }}
          </VBox>
        </VFormField>

        <VFormField id="sourceRef" label="Source References">
          <VStack gap="xs">
            <VBox
              v-for="refNode in (localNode.sourceRef || [])"
              :key="refNode.id"
              padding="xs"
              rounded="md"
              border="all"
              background="slate-50"
              class="flex items-center justify-between"
            >
              <VCluster gap="sm" align="center" class="min-w-0">
                <VIcon :name="getNodeIcon(refNode.type)" size="xs" class="text-indigo-500" />
                <VTypography size="xs" color="slate-800" class="truncate">
                  {{ refNode.label }}
                </VTypography>
              </VCluster>
              <VBox class="px-2 py-0.5 rounded-full bg-white border border-slate-200 text-[10px] text-slate-500">
                {{ refNode.status }}
              </VBox>
            </VBox>
            <VTypography v-if="!(localNode.sourceRef?.length)" size="xs" color="slate-400">
              No references linked.
            </VTypography>
          </VStack>
        </VFormField>
      </VStack>

      <VEntityStatusActionGroup
        :is-new="props.isNew"
        :is-locked="localNode.status === 'LOCKED'"
        :is-modified="isModified"
        :disabled="!localNode.label"
        :labels="{
          unlockedDraft: 'Save Draft',
          unlockedHold: 'Put On Hold',
          unlockedPrimary: 'Lock Node',
          unlockedPrimaryClass: 'bg-emerald-600! hover:bg-emerald-700!',
          lockedHold: 'Put On Hold',
          lockedPrimary: 'Save'
        }"
        @cancel="emit('cancel')"
        @submit="handleSubmit"
      />
    </VStack>
  </VBox>
</template>

<script setup lang="ts">
import VButton from '@/components/atoms/buttons/VButton.vue';
import VInput from '@/components/atoms/forms/VInput.vue';
import VSelect from '@/components/atoms/forms/VSelect.vue';
import VTextarea from '@/components/atoms/forms/VTextarea.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import VEntityStatusActionGroup from '@/components/molecules/domain/VEntityStatusActionGroup.vue';
import VFormField from '@/components/molecules/forms/VFormField.vue';
import { ICON_MAP } from '@/constants/canvases';
import type { ConceptualNode, NodeType } from '@/interfaces/conceptual-map';
import type { EntityStatus } from '@/interfaces/core';
import { computed, ref } from 'vue';
import { useProjectStore } from '@/stores/project';

const projectStore = useProjectStore();

const props = defineProps<{ node: ConceptualNode; isNew?: boolean }>();
const emit = defineEmits(['confirm', 'cancel']);

const availableNodeTypes: NodeType[] = [
  'EVENT', 'OUTCOME', 'BOUNDARY', 'ENTITY',
  'FOCUS', 'RESOURCE', 'CONCEPT', 'INSIGHT',
  'QUERY', 'NAVIGATION', 'GROUP'
];

const localNode = ref({ ...props.node });
const isModified = computed(() => JSON.stringify(localNode.value) !== JSON.stringify(props.node));

const getNodeIcon = (type: NodeType): string => {
  return ICON_MAP[type] || 'Document';
};

const nodeTypeIcon = computed(() => getNodeIcon(localNode.value.type));

const handleSubmit = (status: EntityStatus) => {
  let node = { ...localNode.value, status };

  if (props.isNew) {
    projectStore.createConceptualNodes(node);
  } else {
    projectStore.updateConceptualNode(node);
  }

  emit('confirm');
};
</script>
