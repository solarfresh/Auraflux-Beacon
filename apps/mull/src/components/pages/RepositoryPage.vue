<template>
  <VBox tag="main" class="w-full min-h-screen">
    <VBox intent="neutral" surface="base" padding="sm" class="max-w-5xl mx-auto w-full">
      <!-- ========================================== -->
      <!-- 1. Header Area: RepositoryToolbar Organism -->
      <!-- ========================================== -->
      <RepositoryToolbar
        v-model:search-query="searchQuery"
        v-model:selected-domain="selectedDomain"
        :total-chunks="totalChunks"
        :file-count="files.length"
        @refresh="refreshData"
      />

      <!-- ========================================== -->
      <!-- 2. Main Content Area: Master-Detail Layout -->
      <!-- ========================================== -->

      <VCluster
        align="stretch"
        fullWidth
        class="flex-1 min-h-0 overflow-hidden"
      >
        <!-- Left Area: Master File List -->
        <RepositoryFileList
          :files="files"
          :selected-id="selectedFileId"
          @select="handleSelectFile"
        />

        <!-- Right Area: Detail Chunk List -->
        <VBox
          tag="main"
          padding="lg"
          class="flex-1 h-full overflow-y-auto"
        >
          <VStack gap="md" align="stretch" class="max-w-4xl mx-auto">
            <!-- Active File Header Bar -->
            <VBox
              border="bottom"
              intent="neutral"
              surface="solid"
              padding="none"
              class="pb-2"
            >
              <VCluster justify="between" align="center" fullWidth>
                <VSectionHeader
                  :title="activeFile ? activeFile.name : 'All Chunks'"
                  icon="DocumentText"
                  size="md"
                  weight="bold"
                >
                  <template #extra>
                    <VBadge attention="secondary" size="sm" class="font-mono">
                      {{ filteredChunks.length }} Chunks Found
                    </VBadge>
                  </template>
                </VSectionHeader>
              </VCluster>
            </VBox>

            <!-- Chunk Cards List -->
            <template v-if="filteredChunks.length > 0">
              <ChunkCard
                v-for="chunk in filteredChunks"
                :key="chunk.id"
                :chunk="chunk"
                class="shadow-md"
              />
            </template>

            <!-- Empty State -->
            <VBox
              v-else
              padding="xl"
              rounded="lg"
              border="all"
            >
              <VStack gap="xs" align="center" justify="center" class="text-center">
                <VIcon name="FolderOpen" size="lg" type="outline" class="opacity-40" />
                <VTypography tag="p" size="sm" weight="medium">
                  No matching chunks found
                </VTypography>
              </VStack>
            </VBox>
          </VStack>
        </VBox>
      </VCluster>
    </VBox>
  </VBox>
</template>

<script setup lang="ts">
/**
 * RepositoryView Page Component
 * Renders the primary Master-Detail layout for exploring repository files and chunk cards.
 * Refactored using Layout Atoms (VBox, VStack, VCluster) and Organisms.
 */
import { ref, computed } from 'vue';

// Design System Components
import VBox from '@auraflux/design-system/components/atoms/layout/VBox.vue';
import VStack from '@auraflux/design-system/components/atoms/layout/VStack.vue';
import VCluster from '@auraflux/design-system/components/atoms/layout/VCluster.vue';
import VTypography from '@auraflux/design-system/components/atoms/indicators/VTypography.vue';
import VBadge from '@auraflux/design-system/components/atoms/indicators/VBadge.vue';
import VSectionHeader from '@auraflux/design-system/components/molecules/indicators/VSectionHeader.vue';
import VIcon from '@auraflux/design-system/components/atoms/indicators/VIcon.vue';

// Domain Organisms / Molecules
import RepositoryToolbar from '@/components/organisms/repositories/RepositoryToolbar.vue';
import RepositoryFileList, { type FileItem } from '@/components/organisms/repositories/RepositoryFileList.vue';
import ChunkCard from '@/components/organisms/repositories/RepositoryChunkCard.vue';

import type { ChunkData } from '@/interfaces/repository';

// --- State ---
const searchQuery = ref('');
const selectedDomain = ref('');
const selectedFileId = ref<string | number>('f1');

// --- Mock Master Files Data ---
const files = ref<FileItem[]>([
  { id: 'f1', name: 'architecture_spec.pdf', type: 'pdf', chunkCount: 2, size: '2.4 MB', status: 'ready' },
  { id: 'f2', name: 'security_policy_v2.docx', type: 'doc', chunkCount: 1, size: '1.1 MB', status: 'ready' },
  { id: 'f3', name: 'data_pipeline.py', type: 'code', chunkCount: 1, size: '340 KB', status: 'processing' },
]);

// --- Mock Chunks Data compliant with repository.ts ---
const chunks = ref<ChunkData[]>([
  {
    id: 'e58ed02b-a81d-40c2-9e32-22502c3d4a1b',
    fileId: 'f1',
    alignment: {
      targetQuestion: '當第三方服務商存取敏感資料時，有哪些地緣法規與稽核邊界限制？',
      scope: {
        domain: 'Data Protection',
        impactLevel: 'strategic',
        boundaries: [
          '禁止未經加密的敏感數據傳輸至非 GDPR 適格之第三國伺服器',
          '嚴禁第三方服務商於本機建立任何形式的持久化資料快取 (Local Cache)',
          '稽核 Log 記錄保存時間不得少於 180 天，且不得由操作者自行刪除',
        ],
      },
    },
    concept: {
      title: 'Data Sovereignty vs. Architectural Agility',
      description: '跨國數據存取必須遵循最少權限原則，並建立即時自動化稽核軌跡，以確保滿足地緣政治法規之合規標準。',
    },
    keywords: {
      tags: ['compliance', 'gdpr', 'data-security'],
      triples: [
        { subject: 'Third-Party Provider', predicate: 'must execute', object: 'Standard Contractual Clauses (SCC)' },
        { subject: 'Data Transfer Audit', predicate: 'requires logging within', object: '24 Hours' },
        { subject: 'DPO Approval', predicate: 'is mandatory for', object: 'Cross-Border Access' },
        { subject: 'Storage Encryption', predicate: 'must comply with', object: 'AES-256' },
      ],
    },
    evidence: {
      location: 'Page 14, Section 4.2.1',
      excerptText: 'All third-party processors handling restricted category data shall implement automated audit logging and submit quarterly compliance certificates to the Data Protection Officer.',
    },
  },
  {
    id: '7f91c3d2-3b1a-4c22-8e10-912345678abc',
    fileId: 'f1',
    alignment: {
      targetQuestion: '系統微服務架構如何設計備援機制以確保 99.99% 可用性？',
      scope: {
        domain: 'Architecture',
        impactLevel: 'tactical',
        boundaries: [
          '主備資料庫切換時間 (RTO) 不得超過 30 秒',
          '跨區域資料同步延遲 (RPO) 必須低於 1 秒',
        ],
      },
    },
    concept: {
      title: 'High Availability & Fault Tolerance Design',
      description: '透過 Multi-Region Active-Active 架構與斷路器機制，防止單點故障引起的雪崩效應。',
    },
    keywords: {
      tags: ['microservices', 'high-availability', 'database'],
      triples: [
        { subject: 'Database Replication', predicate: 'utilizes', object: 'Raft Consensus' },
        { subject: 'Failover Timeout', predicate: 'is capped at', object: '30 Seconds' },
      ],
    },
    evidence: {
      location: 'Page 22, Section 5.1',
      excerptText: 'The architecture incorporates multi-region deployment with automated failover managed by global load balancers.',
    },
  },
  {
    id: '3c82d1a0-9e4f-4d11-b823-112233445566',
    fileId: 'f2',
    alignment: {
      targetQuestion: '企業內部零信任（Zero Trust）存取架構的驗證標準為何？',
      scope: {
        domain: 'IT Security',
        impactLevel: 'strategic',
        boundaries: [
          '嚴禁任何無 MFA 驗證的內部 IP 直連核心 API',
          '禁止長期有效的 Session Token 存在，過期後必須重新授權',
        ],
      },
    },
    concept: {
      title: 'Never Trust, Always Verify',
      description: '網路邊界不可信，所有存取請求皆須經過強身分認證、設備健康度審查與動態權限給予。',
    },
    keywords: {
      tags: ['zero-trust', 'mfa', 'identity'],
      triples: [
        { subject: 'Access Control', predicate: 'enforces', object: 'Multi-Factor Authentication (MFA)' },
        { subject: 'Session Token', predicate: 'expires in', object: '15 Minutes' },
      ],
    },
    evidence: {
      location: 'Section 2.3',
      excerptText: 'Identity verification must be performed continuously, with session re-evaluation triggered upon every sensitive operation.',
    },
  },
]);

// --- Computeds ---
const activeFile = computed(() => files.value.find((f) => f.id === selectedFileId.value));

const totalChunks = computed(() => chunks.value.length);

const filteredChunks = computed(() => {
  return chunks.value.filter((c) => {
    // 1. Filter by selected file (fileId)
    if (selectedFileId.value && c.fileId !== selectedFileId.value) {
      return false;
    }

    // 2. Filter by domain (alignment.scope.domain)
    if (selectedDomain.value && c.alignment?.scope?.domain !== selectedDomain.value) {
      return false;
    }

    // 3. Multi-layer search filter
    if (searchQuery.value.trim()) {
      const q = searchQuery.value.toLowerCase();

      // Layer 1: Target Question & Boundaries
      const matchQuestion = c.alignment?.targetQuestion?.toLowerCase().includes(q) ?? false;
      const matchBoundaries = c.alignment?.scope?.boundaries?.some(
        (b) => b.toLowerCase().includes(q)
      ) ?? false;

      // Layer 2: Concept Title & Description
      const matchConceptTitle = c.concept?.title?.toLowerCase().includes(q) ?? false;
      const matchConceptDesc = c.concept?.description?.toLowerCase().includes(q) ?? false;

      // Layer 3: Tags & Semantic Triples
      const matchTags = c.keywords?.tags?.some(
        (tag) => tag.toLowerCase().includes(q)
      ) ?? false;
      const matchTriples = c.keywords?.triples?.some(
        (t) =>
          t.subject.toLowerCase().includes(q) ||
          t.predicate.toLowerCase().includes(q) ||
          t.object.toLowerCase().includes(q)
      ) ?? false;

      // Layer 4: Evidence Excerpt & Location
      const matchEvidenceText = c.evidence?.excerptText?.toLowerCase().includes(q) ?? false;
      const matchEvidenceLoc = c.evidence?.location?.toLowerCase().includes(q) ?? false;

      return (
        matchQuestion ||
        matchBoundaries ||
        matchConceptTitle ||
        matchConceptDesc ||
        matchTags ||
        matchTriples ||
        matchEvidenceText ||
        matchEvidenceLoc
      );
    }

    return true;
  });
});

// --- Methods ---
const handleSelectFile = (id: string | number) => {
  selectedFileId.value = id;
};

const refreshData = () => {
  console.log('Refreshing repository data...');
};
</script>