import { defineStore } from 'pinia';
import type { ChunkData, RepositoryFile } from '@/interfaces/repository';
import type { ID } from '@auraflux/design-system/interfaces/core';
import { apiService } from '@/api/apiService';

export interface RepositoryState {
  files: RepositoryFile[];
  chunks: ChunkData[];
  error: string | null;
  selectedFileId: ID;
  searchQuery: string;
  selectedDomain: string;
};

export const useRepositoryStore = defineStore('repository', {
  state: (): RepositoryState => ({
    // --- Master Files Data ---
    files: [],

    // --- Chunks Data compliant with repository.ts ---
    chunks: [],
    error: null,

    // --- Active UI Filters State ---
    selectedFileId: '',
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

    filteredFiles(): RepositoryFile[] {
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
    async deleteFile(projectId: ID, fileId: ID) {
      try {
        const response = await apiService.projects.files.details.delete(projectId, fileId);
        if (response.data) {
          const index = this.files.findIndex(f => f.id === fileId);
          this.files.splice(index, 1);
        }
      } catch {
        console.error(`Failed to delete file ${fileId} from project ${projectId}.`);
      }
    },

    async fetchData(projectId: ID) {
      try {
        const response = await apiService.projects.files.get(projectId);
        if (response.data) {
          this.files = response.data;
          this.chunks = response.data.flatMap((file) => file.chunks || []);
          if (!this.selectedFileId && this.files.length > 0) {
            this.selectedFileId = this.files[0].id;
          }
        } else {
          console.warn(`No repository files found for project ${projectId}. Using mock data.`);
        }
      } catch {
        console.error(`Failed to fetch repository files for project ${projectId}. Using mock data.`);
      }

    },

    async refreshData() {
      console.log('Fetching fresh repository data from API...');
    },

    selectFile(fileId: ID) {
      this.selectedFileId = fileId;
    },

    setSearchQuery(query: string) {
      this.searchQuery = query;
    },

    setSelectedDomain(domain: string) {
      this.selectedDomain = domain;
    },

    async uploadRepositoryFiles(projectId: ID, files: File[]) {
      if (!projectId) {
        console.warn("No current project selected. Cannot upload files.");
        return;
      }

      const formData = new FormData();
      for (const file of files) {
        formData.append('files', file);
      }

      try {
        const response = await apiService.projects.files.upload(projectId, formData);
        if (response.data) {
          this.files = this.files.concat(response.data.successfulFiles);
        } else {
          console.warn('No data returned from file upload API');
        }
      } catch (err: any) {
        this.error = err.message || 'An unknown error occurred'
        console.error(err)
      }
    }
  },
});