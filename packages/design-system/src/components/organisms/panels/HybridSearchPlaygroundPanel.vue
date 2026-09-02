<template>
  <VBox
    tag="section"
    padding="none"
    border="none"
    class="flex flex-col h-full"
  >
    <!-- Right Panel Header -->
    <VBox
      tag="div"
      padding="none"
      border="bottom"
      class="flex items-center justify-between shrink-0 pt-6 pb-4"
    >
      <VCluster gap="sm" align="center">
        <VIcon name="play-circle" type="outline" size="sm" />
        <VTypography tag="h2" size="sm" weight="semibold">
          Hybrid Search Playground
        </VTypography>
      </VCluster>

      <VButton
        intent="success"
        size="xs"
        :loading="isSearching"
        class="flex items-center space-x-1.5"
        @click="handleRunTest"
      >
        <template #icon>
          <VIcon v-if="!isSearching" name="play" type="solid" size="xs" />
        </template>
        <span>Run Search Test</span>
      </VButton>
    </VBox>

    <!-- Playground Content Area -->
    <VStack
      gap="lg"
      padding="lg"
      scrollable
      class="flex-1"
    >
      <!-- Input Query Section -->
      <VStack gap="xs">
        <VTypography
          tag="label"
          size="xs"
          weight="semibold"
          attention="tertiary"
          class="uppercase tracking-wider block"
        >
          Test Query
        </VTypography>

        <VInput
          v-model="internalQueryText"
          placeholder="Enter test query..."
          size="sm"
          rounded="lg"
        />
      </VStack>

      <!-- Rank Breakdown Table Section -->
      <VStack gap="xs">
        <div class="flex items-center justify-between">
          <VTypography
            tag="label"
            size="xs"
            weight="semibold"
            attention="tertiary"
            class="uppercase tracking-wider"
          >
            RRF Rank Breakdown
          </VTypography>
          <VTypography tag="span" size="xs" attention="tertiary" class="font-mono text-[10px]">
            OpenSearch Hybrid Pipeline
          </VTypography>
        </div>

        <VDataTable
          :columns="tableColumns"
          :data="breakdownData"
          :pagination="false"
          :selectable="false"
          size="xs"
        >
          <!-- RRF Rank Cell -->
          <template #cell-rrfRank="{ value }">
            <VTypography
              size="xs"
              weight="bold"
              :class="value === '#1' ? SUCCESS_SURFACE_MAP.base.text : NEUTRAL_SURFACE_MAP.base.text"
              align="center"
            >
              {{ value }}
            </VTypography>
          </template>

          <!-- Content Preview Cell -->
          <template #cell-content="{ value }">
            <VTypography size="xs" class="line-clamp-2 leading-snug">
              {{ value }}
            </VTypography>
          </template>

          <!-- Vector Rank Cell -->
          <template #cell-vectorRank="{ value }">
            <VBox
              tag="div"
              padding="none"
              border="none"
              rounded="sm"
              :class="[INFO_SURFACE_MAP.soft.bg, 'py-0.5 text-center']"
            >
              <VTypography size="xs" intent="info" class="font-mono">
                {{ value }}
              </VTypography>
            </VBox>
          </template>

          <!-- BM25 Rank Cell -->
          <template #cell-bm25Rank="{ value }">
            <VBox
              tag="div"
              padding="none"
              border="none"
              rounded="sm"
              :class="[
                String(value).startsWith('#1') || String(value).startsWith('#2') ? SUCCESS_SURFACE_MAP.soft.bg : '',
                'py-0.5 text-center'
              ]"
            >
              <VTypography
                size="xs"
                :intent="String(value).startsWith('#1') || String(value).startsWith('#2') ? 'success' : 'neutral'"
                class="font-mono"
              >
                {{ value }}
              </VTypography>
            </VBox>
          </template>

          <!-- Score Cell -->
          <template #cell-score="{ value }">
            <VTypography size="xs" weight="semibold" align="end" class="font-mono">
              {{ value }}
            </VTypography>
          </template>
        </VDataTable>
      </VStack>

      <!-- Metric Cards Grid -->
      <VGrid :cols="3" gap="sm">
        <VCard padding="sm" rounded="lg" border="all">
          <VTypography size="xs" attention="tertiary" align="center" class="uppercase tracking-wider text-[10px]">
            Search Latency
          </VTypography>
          <VTypography size="sm" weight="semibold" align="center" class="mt-0.5">
            {{ metrics.latency }} ms
          </VTypography>
        </VCard>

        <VCard padding="sm" rounded="lg" border="all">
          <VTypography size="xs" attention="tertiary" align="center" class="uppercase tracking-wider text-[10px]">
            Embedding Cost
          </VTypography>
          <VTypography size="sm" weight="semibold" align="center" class="mt-0.5">
            {{ metrics.tokens }} tokens
          </VTypography>
        </VCard>

        <VCard padding="sm" rounded="lg" border="all">
          <VTypography size="xs" attention="tertiary" align="center" class="uppercase tracking-wider text-[10px]">
            RRF Pipeline
          </VTypography>
          <VTypography size="sm" weight="semibold" intent="success" align="center" class="mt-0.5">
            {{ metrics.status }}
          </VTypography>
        </VCard>
      </VGrid>
    </VStack>
  </VBox>
</template>

<script setup lang="ts">
/**
 * HybridSearchPlaygroundPanel Component
 * Interactive testing playground for OpenSearch RRF Hybrid Search tuning.
 *
 * @category Organisms
 * @subcategory Search
 */
import VButton from '@auraflux/design-system/components/atoms/buttons/VButton.vue';
import VInput from '@auraflux/design-system/components/atoms/forms/VInput.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VGrid from '@auraflux/design-system/components/atoms/layout/VGrid.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VCard from '@auraflux/design-system/components/molecules/resources/VCard.vue';
import VDataTable, {
  type VDataTableColumn,
} from '@auraflux/design-system/components/organisms/tables/VDataTable.vue';
import {
  INFO_SURFACE_MAP,
  NEUTRAL_SURFACE_MAP,
  SUCCESS_SURFACE_MAP
} from '@auraflux/design-system/constants/theme';
import { computed } from 'vue';

export interface RankBreakdownItem {
  id: string | number;
  rrfRank: string;
  content: string;
  vectorRank: string;
  bm25Rank: string;
  score: string | number;
}

export interface SearchMetrics {
  latency: number;
  tokens: number;
  status: string;
}

export interface HybridSearchPlaygroundPanelProps {
  /** Two-way bound query string */
  queryText?: string;
  /** RRF rank result dataset */
  breakdownData?: RankBreakdownItem[];
  /** Search metrics (latency, token usage, status) */
  metrics?: SearchMetrics;
  /** Indicates whether search testing request is pending */
  isSearching?: boolean;
}

const props = withDefaults(defineProps<HybridSearchPlaygroundPanelProps>(), {
  queryText: '',
  breakdownData: () => [],
  metrics: () => ({
    latency: 0,
    tokens: 0,
    status: 'Idle',
  }),
  isSearching: false,
});

const emit = defineEmits<{
  (e: 'update:queryText', value: string): void;
  (e: 'run-test'): void;
}>();

const internalQueryText = computed({
  get: () => props.queryText,
  set: (val: string) => emit('update:queryText', val),
});

const tableColumns: VDataTableColumn[] = [
  { key: 'rrfRank', label: 'RRF', width: '48px', align: 'center' },
  { key: 'content', label: 'Chunk Preview', align: 'start' },
  { key: 'vectorRank', label: 'Vector', width: '80px', align: 'center' },
  { key: 'bm25Rank', label: 'BM25', width: '80px', align: 'center' },
  { key: 'score', label: 'Score', width: '80px', align: 'end' },
];

const handleRunTest = () => {
  emit('run-test');
};
</script>