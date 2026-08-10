import { defineStore } from 'pinia';
import type { ChunkData, FileItem } from '@/interfaces/repository';
import type { ID } from '@auraflux/shared-core/interfaces/core';

export interface RepositoryState {
  files: FileItem[];
  chunks: ChunkData[];
  selectedFileId: ID;
  searchQuery: string;
  selectedDomain: string;
}

export const useRepositoryStore = defineStore('repository', {
  state: (): RepositoryState => ({
    // --- Master Files Data ---
    files: [
      { id: 'f1', name: 'architecture_spec.pdf', type: 'pdf', chunkCount: 2, size: '2.4 MB', status: 'ready' },
      { id: 'f2', name: 'security_policy_v2.docx', type: 'doc', chunkCount: 1, size: '1.1 MB', status: 'ready' },
      { id: 'f3', name: 'data_pipeline.py', type: 'code', chunkCount: 1, size: '340 KB', status: 'processing' },
    ],

    // --- Chunks Data compliant with repository.ts ---
    chunks: [
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
    ],

    // --- Active UI Filters State ---
    selectedFileId: 'f1',
    searchQuery: '',
    selectedDomain: '',
  }),

  getters: {
    totalChunks: (state) => state.chunks.length,

    activeFile: (state) => {
      return state.files.find((file) => file.id === state.selectedFileId) || null;
    },

    domains: (state) => {
      const set = new Set<string>();
      state.chunks.forEach((chunk) => {
        const domain = chunk.alignment?.scope?.domain;
        if (domain) {
          set.add(domain);
        }
      });
      return Array.from(set);
    },

    filteredChunks: (state) => {
      return state.chunks.filter((c) => {
        // 1. Filter by selected file (fileId)
        if (state.selectedFileId && c.fileId !== state.selectedFileId) {
          return false;
        }

        // 2. Filter by domain (alignment.scope.domain)
        if (state.selectedDomain && c.alignment?.scope?.domain !== state.selectedDomain) {
          return false;
        }

        // 3. Multi-layer search filter
        if (state.searchQuery.trim()) {
          const q = state.searchQuery.toLowerCase();

          const matchQuestion = c.alignment?.targetQuestion?.toLowerCase().includes(q) ?? false;
          const matchBoundaries = c.alignment?.scope?.boundaries?.some(
            (b) => b.toLowerCase().includes(q)
          ) ?? false;

          const matchConceptTitle = c.concept?.title?.toLowerCase().includes(q) ?? false;
          const matchConceptDesc = c.concept?.description?.toLowerCase().includes(q) ?? false;

          const matchTags = c.keywords?.tags?.some(
            (tag) => tag.toLowerCase().includes(q)
          ) ?? false;
          const matchTriples = c.keywords?.triples?.some(
            (t) =>
              t.subject.toLowerCase().includes(q) ||
              t.predicate.toLowerCase().includes(q) ||
              t.object.toLowerCase().includes(q)
          ) ?? false;

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
    },

    filteredFiles(): FileItem[] {
      if (!this.searchQuery.trim() && !this.selectedDomain) {
        return this.files;
      }

      const matchingChunks = this.filteredChunks;

      const fileMatchMap = new Map<string | number, number>();
      matchingChunks.forEach((chunk) => {
        if (chunk.fileId) {
          const count = fileMatchMap.get(chunk.fileId) || 0;
          fileMatchMap.set(chunk.fileId, count + 1);
        }
      });

      return this.files
        .filter((file) => fileMatchMap.has(file.id))
        .map((file) => ({
          ...file,
          chunkCount: fileMatchMap.get(file.id) || 0,
        }));
      },

  },

  actions: {
    selectFile(fileId: ID) {
      this.selectedFileId = fileId;
    },

    setSearchQuery(query: string) {
      this.searchQuery = query;
    },

    setSelectedDomain(domain: string) {
      this.selectedDomain = domain;
    },

    async refreshData() {
      console.log('Fetching fresh repository data from API...');
    },
  },
});