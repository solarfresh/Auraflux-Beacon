<template>
  <BaseSidebarLayout
    title="Consultation Brain"
    :item-count="confirmedConsensusCount"
  >
    <template #header-actions>
      <VButton variant="ghost" size="xs" title="Jump to Sandbox" @click="scrollToSandbox">
        <VIcon name="Zap" size="sm" class="text-indigo-400" />
      </VButton>
      <VButton variant="secondary" size="xs" @click="emit('open-material-manager')">
        <VCluster gap="xs">
          <VIcon name="FolderOpen" size="sm" />
          <VTypography tag="span" size="xs" weight="medium">Materials</VTypography>
        </VCluster>
      </VButton>
    </template>

    <template #body>
      <VStack gap="md" class="min-w-0 transition-all duration-300">

        <ConsultationAlert
          v-if="activeAlert"
          :type="activeAlert.type"
          :title="activeAlert.title"
          :description="activeAlert.description"
          :consensus="activeAlert.consensus"
          :conflict-data="activeAlert.conflictData"
          class="animate-in fade-in slide-in-from-top-2"
          @resolve="handleResolveGovernance"
          @dismiss="handleDismissGovernance"
        />

        <VBox v-if="activeAlert" border="bottom" />

        <VStack gap="xs" class="w-full">
          <SidebarRegistrySection
            title="Proposals"
            section-type="TOP"
            :nodes="mappedProposals"
            :selected-node-id="selectedNodeId"
            @select="handleNodeSelect"
            @hover="handleNodeHover"
            @teleport="handleProposalTeleport"
            @add="navigateToProposalManager"
          />

          <SidebarRegistrySection
            title="Reflections"
            section-type="MIDDLE"
            :nodes="mappedReflections"
            :selected-node-id="selectedNodeId"
            :can-add="true"
            @add="handleAddNewReflection"
            @select="handleNodeSelect"
            @hover="handleNodeHover"
          />

          <SidebarRegistrySection
            title="Consensus Baselines"
            section-type="BOTTOM"
            :nodes="mappedConsensus"
            :selected-node-id="selectedNodeId"
            @select="handleNodeSelect"
            @hover="handleNodeHover"
          />

          <VBox class="h-16" aria-hidden="true" />
        </VStack>
      </VStack>

      <VBox
        v-if="isEditorOpen && editingNode"
        class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs"
        @click.self="isEditorOpen = false"
      >
        <VNodeFormEditor
          :node="editingNode"
          @confirm="handleSave"
          @cancel="isEditorOpen = false"
        />
      </VBox>
    </template>
  </BaseSidebarLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import BaseSidebarLayout from '@/components/organisms/layout/BaseSidebarLayout.vue';
import SidebarRegistrySection from '@/components/organisms/sections/SidebarRegistrySection.vue';
import ConsultationAlert from '@/components/organisms/doamin/consultation/ConsultationAlert.vue';
import VNodeFormEditor from '@/components/organisms/forms/VNodeFormEditor.vue';

import type { ConceptualNode, NodeType } from '@/interfaces/conceptual-map';
import type { EntityStatus, ID } from '@/interfaces/core';

const emit = defineEmits<{
  (e: 'open-material-manager'): void;
  (e: 'open-consensus-manager'): void;
  (e: 'resolve-conflict'): void;
  (e: 'node-selected', id: ID): void;
  (e: 'node-hovered', id: ID | null): void;
  (e: 'teleport-node', id: string): void;
}>();

// --- ⚙️ Core Telemetry States ---
const confirmedConsensusCount = ref<number>(4);
const hasLogicConflict = ref<boolean>(false);
const selectedNodeId = ref<ID | null>(null);

// --- 📦 Normalized Business Domain Data Models ---
interface ConsultationGap {
  id: string;
  title: string;
  description: string;
  consensus?: string;
}

/** * Refactored: Replaced explicit Proposal interface with ConceptualNode
 * to enforce structural integrity across all domain modules.
 */
const activeProposals = ref<ConceptualNode[]>([
  {
    id: 'prop-001',
    type: 'RESOURCE',
    label: 'Q3 Market Penetration',
    content: 'Focus on social media ad spend for the upcoming product launch.',
    status: 'AI_EXTRACTED'
  },
  {
    id: 'prop-002',
    type: 'BOUNDARY',
    label: 'ISO-27001 Compliance Audit',
    content: 'Initiate mandatory data security audit for the European market entry.',
    status: 'USER_DRAFT'
  }
]);

const insightsList = ref<ConsultationGap[]>([
  {
    id: 'insight-resource-01',
    title: 'RESOURCE Dimension Interrupted',
    description: 'Discussion lacks external evidence for specified market constraints.',
    consensus: 'Fiscal Discipline Baseline (Cap $200k)'
  }
]);

// --- 🔄 Structural Adapters ---
const mappedProposals = computed<ConceptualNode[]>(() => activeProposals.value);

const mappedReflections = computed<ConceptualNode[]>(() => [{
  id: 'reflect-001',
  type: 'CONCEPT',
  label: 'Client Overheads Hesitation',
  content: 'Client sounded hesitant when overhead thresholds were brought up.',
  status: 'USER_DRAFT'
}]);

const mappedConsensus = computed<ConceptualNode[]>(() => [{
  id: 'consensus-001',
  type: 'OUTCOME',
  label: 'Verified Fiscal Discipline Baseline',
  content: `Currently maintaining ${confirmedConsensusCount.value} verified checkpoints.`,
  status: 'LOCKED'
}]);

const isNewNode = ref(false);
const isEditorOpen = ref(false);
const editingNode = ref<ConceptualNode | null>(null);

// --- 🧠 Computed Indicators ---
const primaryGap = computed<ConsultationGap | null>(() => insightsList.value[0] || null);

const activeConflict = ref({
  title: 'Resource Allocation Violation',
  proposedAction: 'Increase Q3 Marketing Budget to $500k',
  baselineReference: 'Strategic Baseline: Operational Efficiency (Cap $200k)',
  impactAssessment: 'This proposal contradicts the agreed-upon fiscal discipline.'
});

const activeAlert = computed(() => {
  if (activeConflict.value) {
    return {
      type: 'CONFLICT' as const,
      title: activeConflict.value.title,
      conflictData: activeConflict.value
    };
  }
  if (primaryGap.value) {
    return {
      type: 'GAP' as const,
      title: primaryGap.value.title,
      description: primaryGap.value.description,
      consensus: primaryGap.value.consensus
    };
  }
  return null;
});

const handleAddNewReflection = () => {
  editingNode.value = {
    id: `new-${Date.now()}`,
    type: 'CONCEPT', // 或是 INSIGHT
    label: '',
    status: 'USER_DRAFT'
  };

  isNewNode.value = true;
  isEditorOpen.value = true;
};

const handleResolveGovernance = () => {
  if (hasLogicConflict.value) emit('resolve-conflict');
  else console.log('[Router] Calibration');
};

const handleDismissGovernance = () => {
  if (hasLogicConflict.value) hasLogicConflict.value = false;
  else insightsList.value = [];
};

// --- ⚡ Event Handlers ---
const handleNodeSelect = (id: ID) => {
  selectedNodeId.value = id;

  const allNodes = [...activeProposals.value, ...mappedReflections.value, ...mappedConsensus.value];
  const targetNode = allNodes.find(n => n.id === id);

  if (targetNode) {
    editingNode.value = { ...targetNode };
    isEditorOpen.value = true;
  }

  emit('node-selected', id);
};
const handleNodeHover = (id: ID | null) => { emit('node-hovered', id); };
const handleProposalTeleport = (id: string) => { emit('teleport-node', id); };

const navigateToStageThreeCalibration = (insightId: string) => {
  console.log(`[Router] Calibration: ${insightId}`);
};

const navigateToProposalManager = () => {
  emit('open-consensus-manager');
};

const sandboxContainer = ref<HTMLElement | null>(null);
const scrollToSandbox = () => { sandboxContainer.value?.scrollIntoView({ behavior: 'smooth' }); };

const handleSave = (updatedNode: ConceptualNode) => {
  const index = activeProposals.value.findIndex(n => n.id === updatedNode.id);
  if (index !== -1) {
    activeProposals.value[index] = updatedNode;
  }

  isEditorOpen.value = false;
  editingNode.value = null;
};
</script>