<template>
  <BaseSidebarLayout
    title="Consultation Brain"
    :item-count="confirmedConsensusCount"
  >
    <template #header-actions>
      <!-- Sandbox Quick-Action Icon -->
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
      <VStack gap="lg" class="min-w-0 transition-all duration-300">

        <!-- 1. Global Navigator (Dynamic State Controller) -->
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

        <!-- 2. Logic Conflict Alert (Dynamic Intervention - High Priority) -->
        <LogicConflictAlert
          v-if="hasLogicConflict"
          :conflict-data="activeConflict"
          class="animate-in fade-in slide-in-from-top-2"
          @resolve="emit('resolve-conflict')"
          @dismiss="hasLogicConflict = false"
        />

        <VBox border="bottom" />

        <!-- 3. Strategic Cornerstone (Fixed Anchor) -->
<!--
        <StrategicBaselineCard
          :count="confirmedConsensusCount"
          @open-manager="emit('open-consensus-manager')"
        />
 -->
        <!-- 4. Consensus Agenda (Active Workflow) -->
<!--
        <ConsensusProposalList
          @edit-proposal="(id) => emit('edit-proposal', id)"
          @approve="approveProposal"
        />
 -->
        <VBox border="bottom" />

        <!-- 5. Reflection Sandbox (Input Slot) -->
<!--
        <VBox ref="sandboxContainer" class="w-full">
          <ReflectionLogSandbox
            v-model:active-tab="activeReflectTab"
            v-model:input-value="reflectionInput"
            :latest-log="latestCacheLog"
            @submit="submitReflection"
            @open-history="emit('open-reflection-manager')"
          />
        </VBox>
 -->
      </VStack>
    </template>
  </BaseSidebarLayout>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

import BlindSpotNavigator from '@/components/organisms/doamin/consultation/BlindSpotNavigator.vue';
// import ConsensusProposalList from './components/ConsensusProposalList.vue';
import LogicConflictAlert from '@/components/organisms/doamin/consultation/LogicConflictAlert.vue';
// import ReflectionLogSandbox from './components/ReflectionLogSandbox.vue';
// import StrategicBaselineCard from './components/StrategicBaselineCard.vue';

import VButton from '@/components/atoms/buttons/VButton.vue';
import VIcon from '@/components/atoms/indicators/VIcon.vue';
import VTypography from '@/components/atoms/indicators/VTypography.vue';
import VBox from '@/components/atoms/layout/VBox.vue';
import VCluster from '@/components/atoms/layout/VCluster.vue';
import VStack from '@/components/atoms/layout/VStack.vue';
import BaseSidebarLayout from '@/components/organisms/layout/BaseSidebarLayout.vue';

const emit = defineEmits<{
  (e: 'open-material-manager'): void;
  (e: 'open-consensus-manager'): void;
  (e: 'open-reflection-manager'): void;
  (e: 'edit-chip', id: string): void;
  (e: 'edit-proposal', id: string): void;
  (e: 'resolve-conflict'): void;
}>();

const confirmedConsensusCount = ref<number>(4);
const hasLogicConflict = ref<boolean>(true);
const activeReflectTab = ref<'INSIGHT' | 'GAP'>('INSIGHT');
const reflectionInput = ref<string>('');
const latestCacheLog = ref<string>('Client sounded hesitant when overhead thresholds were brought up.');

const submitReflection = (): void => {
  const sanitized = reflectionInput.value.trim();
  if (!sanitized) return;
  latestCacheLog.value = sanitized;
  reflectionInput.value = '';
};

const approveProposal = (id: string): void => {
  confirmedConsensusCount.value += 1;
};

interface NodeDimension {
  type: 'CONCEPT' | 'RESOURCE' | 'BOUNDARY' | 'OUTCOME' | 'EVENT' | 'RISK';
  label: string;
  isActive: boolean;
  activeCount: number;
  totalCount: number;
}

interface AIInsight {
  id: string;
  severity: 'CRITICAL' | 'WARNING' | 'INFO';
  targetDimension: 'CONCEPT' | 'RESOURCE' | 'BOUNDARY' | 'OUTCOME' | 'EVENT' | 'RISK';
  title: string;
  description: string;
  question: string;
  canSidebarPatch: boolean;
  patchActionLabel?: string;
  patchPayload?: Record<string, any>;
}

// --- ⚙️ 全域狀態維護 (Central State Management) ---

/** 1. 宏觀知識圖譜維度覆蓋陣列 */
const dimensions = ref<NodeDimension[]>([
  { type: 'CONCEPT', label: 'Concept', isActive: true, activeCount: 3, totalCount: 4 },
  { type: 'RESOURCE', label: 'Resource', isActive: false, activeCount: 0, totalCount: 2 }, // 亮黃燈核心
  { type: 'BOUNDARY', label: 'Boundary', isActive: true, activeCount: 2, totalCount: 2 },
  { type: 'OUTCOME', label: 'Outcome', isActive: true, activeCount: 1, totalCount: 1 },
  { type: 'EVENT', label: 'Event', isActive: true, activeCount: 1, totalCount: 1 },
  { type: 'RISK', label: 'Risk', isActive: true, activeCount: 1, totalCount: 1 },
]);

/** 2. 全全新重構的盲點 Mock 數據清單 */
const insightsList = ref<AIInsight[]>([
  {
    id: 'insight-resource-01',
    severity: 'CRITICAL',
    targetDimension: 'RESOURCE',
    title: 'RESOURCE Dimension Interrupted',
    description: 'The current discussion heavily weights on target constraints (BOUNDARY) but severely lacks external evidence items or data pillars. This introduces an optimal-illusion bias risk.',
    question: 'What existing metrics or structural resources do you currently have to defend this particular logistics trajectory?',
    canSidebarPatch: false // 複雜斷鏈，強迫穿透跳轉
  },
  {
    id: 'insight-boundary-02',
    severity: 'WARNING',
    targetDimension: 'BOUNDARY',
    title: 'BOUNDARY Drift Warning',
    description: 'Cross-border Tariff Subsidy context was explicitly discussed in the dialogue provenance but remains unmapped, causing potential constraint evaporation.',
    question: 'How exactly will this subsidy restriction map back to your quarterly 20% revenue target?',
    canSidebarPatch: true,
    patchActionLabel: "＋ Capture 'Tariff Subsidy' as Boundary Entity"
  }
]);

/** 3. 控制 Stage 2 手風琴展開的內部開關 */
const isStageTwoExpanded = ref(false);

/** 4. 標準化語系標籤 */
const uiLabels = {
  inspectAction: 'Expand Quick Fix ↓',
  collapseAction: 'Collapse Fix ↑',
  calibrateAction: 'Calibrate Now',
  insightsCountLabel: 'Insights Detected'
};

// --- 🧠 計算屬性調度 (Computed Orchestration) ---

/**
 * 核心權重演算法：自動撈出當前唯一一條最致命的盲點作為 Primary Focus
 * （優先挑選 CRITICAL，若無則依序向下）
 */
const primaryInsight = computed<AIInsight | null>(() => {
  if (insightsList.value.length === 0) return null;

  const critical = insightsList.value.find(i => i.severity === 'CRITICAL');
  if (critical) return critical;

  const warning = insightsList.value.find(i => i.severity === 'WARNING');
  if (warning) return warning;

  return insightsList.value[0] || null;
});

/** 計算當前對齊的維度總數 (用於驅動頂部指標，如 "5 / 6 Dimensions Settled") */
const macroAlignmentString = computed(() => {
  const settledCount = dimensions.value.filter(d => d.isActive).length;
  const totalCount = dimensions.value.length;
  return `${settledCount} / ${totalCount} Dimensions Settled`;
});

/** 是否全盤對齊（若 100% 對齊，指標亮綠燈，否則常駐琥珀燈提示引力失衡） */
const isGraphFullyAligned = computed(() => {
  return dimensions.value.every(d => d.isActive);
});

// --- ⚡ 互動事件處理 (Event Handling Paths) ---

/** 處理 Stage 2 的展開/折疊 */
const handleToggleExpand = () => {
  isStageTwoExpanded.value = !isStageTwoExpanded.value;
};

/** 核心問句穿透：跳轉至 Stage 3 獨立校準中心，並帶入當前邏輯斷裂的節點脈絡 */
const navigateToStageThreeCalibration = (insightId: string) => {
  console.log(`[Router] Penetrating to Stage 3 Deep Calibration Workspace for ID: ${insightId}`);
  // 在實際專案中此處替換為：router.push(`/workspace/calibrate/${insightId}`);
};

const sandboxContainer = ref<HTMLElement | null>(null);

const scrollToSandbox = () => {
  sandboxContainer.value?.scrollIntoView({ behavior: 'smooth' });
  // 此處可增加邏輯自動聚焦 input
};

// 定義衝突物件介面
interface ConflictSummary {
  title: string;
  proposedAction: string;
  baselineReference: string;
  impactAssessment: string;
}

// 預設 Mock Data：模擬資源配置衝突
const activeConflict = ref<ConflictSummary>({
  title: 'Resource Allocation Violation',
  proposedAction: 'Increase Q3 Marketing Budget to $500k',
  baselineReference: 'Strategic Baseline: Operational Efficiency (Cap $200k)',
  impactAssessment: 'This proposal contradicts the agreed-upon fiscal discipline, risking a 15% deficit in the operational reserve if executed.'
});

// 當衝突發生時，外部邏輯可以隨時更新此物件
const triggerConflict = (data: ConflictSummary) => {
  activeConflict.value = data;
  hasLogicConflict.value = true;
};
</script>