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

        <BlindSpotNavigator
          :alignment-string="macroAlignmentString"
          :is-complete="isGraphFullyAligned"
          :is-expanded="isStageTwoExpanded"
          :is-compact="false"
          :total-insights-count="insightsList.length"
          :primary-insight="primaryInsight"
          :ui-labels="uiLabels"
          @toggle-expand="handleToggleExpand"
          @open-calibration="navigateToStageThreeCalibration"
        />

        <LogicConflictAlert
          v-if="hasLogicConflict"
          :conflict-data="activeConflict"
          class="animate-in fade-in slide-in-from-top-2"
          @resolve="emit('resolve-conflict')"
          @dismiss="hasLogicConflict = false"
        />

        <VBox border="bottom" />

        <VStack gap="xs" class="w-full">

          <SidebarRegistrySection
            title="Proposals"
            section-type="TOP"
            :nodes="mappedProposals"
            :selected-node-id="selectedNodeId"
            :can-add="true"
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
            :can-add="false"
            @select="handleNodeSelect"
            @hover="handleNodeHover"
          />

          <SidebarRegistrySection
            title="Consensus Baselines"
            section-type="BOTTOM"
            :nodes="mappedConsensus"
            :selected-node-id="selectedNodeId"
            :can-add="false"
            @select="handleNodeSelect"
            @hover="handleNodeHover"
          />

        </VStack>

      </VStack>
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
import BlindSpotNavigator from '@/components/organisms/doamin/consultation/BlindSpotNavigator.vue';
import LogicConflictAlert from '@/components/organisms/doamin/consultation/LogicConflictAlert.vue';
import BaseSidebarLayout from '@/components/organisms/layout/BaseSidebarLayout.vue';
import SidebarRegistrySection from '@/components/organisms/sections/SidebarRegistrySection.vue';

import type { ConceptualNode, NodeType } from '@/interfaces/conceptual-map';
import type { EntityStatus, ID } from '@/interfaces/core';

const emit = defineEmits<{
  (e: 'open-material-manager'): void;
  (e: 'open-consensus-manager'): void;
  (e: 'open-reflection-manager'): void;
  (e: 'edit-proposal', id: string): void;
  (e: 'resolve-conflict'): void;
  (e: 'node-selected', id: ID): void;
  (e: 'node-hovered', id: ID | null): void;
  (e: 'teleport-node', id: string): void;
}>();

// --- ⚙️ Core Telemetry States ---
const confirmedConsensusCount = ref<number>(4);
const hasLogicConflict = ref<boolean>(true);
const selectedNodeId = ref<ID | null>(null);
const isStageTwoExpanded = ref(false);

// --- 📦 Normalized Business Domain Data Models ---
interface NodeDimension {
  type: NodeType;
  label: string;
  isActive: boolean;
  activeCount: number;
  totalCount: number;
}

interface AIInsight {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  targetDimension: NodeType;
  title: string;
  description: string;
  question: string;
  canSidebarPatch: boolean;
  patchActionLabel?: string;
  patchPayload?: Record<string, any>;
}

interface Proposal {
  id: string;
  title: string;
  description: string;
  status: EntityStatus; // Replaced legacy ProposalStatus with global EntityStatus schema
  createdAt: string;
  dimension: NodeType;
}

const dimensions = ref<NodeDimension[]>([
  { type: 'CONCEPT', label: 'Concept', isActive: true, activeCount: 3, totalCount: 4 },
  { type: 'RESOURCE', label: 'Resource', isActive: false, activeCount: 0, totalCount: 2 },
  { type: 'BOUNDARY', label: 'Boundary', isActive: true, activeCount: 2, totalCount: 2 },
  { type: 'OUTCOME', label: 'Outcome', isActive: true, activeCount: 1, totalCount: 1 },
  { type: 'EVENT', label: 'Event', isActive: true, activeCount: 1, totalCount: 1 },
  { type: 'FOCUS', label: 'FOCUS', isActive: true, activeCount: 1, totalCount: 1 },
]);

const insightsList = ref<AIInsight[]>([
  {
    id: 'insight-resource-01',
    severity: 'CRITICAL',
    targetDimension: 'RESOURCE',
    title: 'RESOURCE Dimension Interrupted',
    description: 'The current discussion heavily weights on target constraints but lacks external evidence.',
    question: 'What existing metrics do you currently have to defend this particular logistics trajectory?',
    canSidebarPatch: false
  }
]);

// Updated mock array values to align fully with core EntityStatus schemas
const activeProposals = ref<Proposal[]>([
  {
    id: 'prop-001',
    title: 'Q3 Market Penetration',
    description: 'Focus on social media ad spend for the upcoming product launch.',
    status: 'AI_EXTRACTED', // Proposed by AI Agent, awaiting user review
    createdAt: '2026-07-01T10:00:00Z',
    dimension: 'RESOURCE'
  },
  {
    id: 'prop-002',
    title: 'ISO-27001 Compliance Audit',
    description: 'Initiate mandatory data security audit for the European market entry.',
    status: 'USER_DRAFT', // Under active editing or curation by the user
    createdAt: '2026-07-01T11:30:00Z',
    dimension: 'BOUNDARY'
  }
]);

// --- 🔄 Structural Adapters with Native Type Inheritance ---

/** * Maps Proposal data models into clean ConceptualNode objects.
 * Since properties are unified under EntityStatus, this inherits pure native types.
 */
const mappedProposals = computed<ConceptualNode[]>(() => {
  return activeProposals.value.map(prop => ({
    id: prop.id,
    type: prop.dimension,
    label: prop.title,
    content: prop.description,
    status: prop.status
  }));
});

/** * Maps active consultation reflection summaries into ConceptualNode blueprints.
 */
const mappedReflections = computed<ConceptualNode[]>(() => {
  return [
    {
      id: 'reflect-001',
      type: 'CONCEPT',
      label: 'Client Overheads Hesitation',
      content: 'Client sounded hesitant when overhead thresholds were brought up during Q2 analysis.',
      status: 'USER_DRAFT'
    }
  ];
});

/** * Maps verified system metrics into consensus check items.
 */
const mappedConsensus = computed<ConceptualNode[]>(() => {
  return [
    {
      id: 'consensus-001',
      type: 'OUTCOME',
      label: 'Verified Fiscal Discipline Baseline',
      content: `Currently maintaining ${confirmedConsensusCount.value} verified strategic consensus checkpoints.`,
      status: 'LOCKED'
    }
  ];
});

// --- 🧠 Computed Indicators ---
const uiLabels = {
  inspectAction: 'Expand Quick Fix ↓',
  collapseAction: 'Collapse Fix ↑',
  calibrateAction: 'Calibrate Now',
  insightsCountLabel: 'Insights Detected'
};

const primaryInsight = computed<AIInsight | null>(() => {
  if (insightsList.value.length === 0) return null;
  return insightsList.value.find(i => i.severity === 'CRITICAL') || insightsList.value[0] || null;
});

const macroAlignmentString = computed(() => {
  const settledCount = dimensions.value.filter(d => d.isActive).length;
  return `${settledCount} / ${dimensions.value.length} Dimensions Settled`;
});

const isGraphFullyAligned = computed(() => dimensions.value.every(d => d.isActive));

const activeConflict = ref({
  title: 'Resource Allocation Violation',
  proposedAction: 'Increase Q3 Marketing Budget to $500k',
  baselineReference: 'Strategic Baseline: Operational Efficiency (Cap $200k)',
  impactAssessment: 'This proposal contradicts the agreed-upon fiscal discipline.'
});

// --- ⚡ Central Unified Event Handlers ---
const handleToggleExpand = () => { isStageTwoExpanded.value = !isStageTwoExpanded.value; };
const handleNodeSelect = (id: ID) => { selectedNodeId.value = id; emit('node-selected', id); };
const handleNodeHover = (id: ID | null) => { emit('node-hovered', id); };
const handleProposalTeleport = (id: string) => { emit('teleport-node', id); };

const navigateToStageThreeCalibration = (insightId: string) => {
  console.log(`[Router] Navigating to Calibration Workspace for Insight: ${insightId}`);
};

const navigateToProposalManager = () => {
  console.log('[Router] Opening Proposal Creation Hub');
  emit('open-consensus-manager');
};

const sandboxContainer = ref<HTMLElement | null>(null);
const scrollToSandbox = () => { sandboxContainer.value?.scrollIntoView({ behavior: 'smooth' }); };
</script>