import { apiService } from '@/api/apiService';
import type { Project } from '@/interfaces/project';
import type { ID } from '@auraflux/design-system/interfaces/core';
import { defineStore } from 'pinia';

interface ProjectState {
  projects: Project[];
  currentProjectId: ID | null;
  isLoading: boolean;
  error: string | null;
};

export const useProjectStore = defineStore('project', {
  state: (): ProjectState => ({
    projects: [],
    currentProjectId: null,
    isLoading: false,
    error: null
  }),

  getters: {
    projectMap: (state) => {
      const map = new Map<string, Project>()
      for (const project of state.projects) {
        map.set(project.id, project);
      }

      return map;
    }
  },

  actions: {
    async createProject(payload: Partial<Project>): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiService.projects.create(payload);
        if (response.data) {
          this.projects.unshift(response.data)
        }
      } catch (err: any) {
        this.error = err.message || 'An unknown error occurred'
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },

    async fetchProjects(tag?: string): Promise<void> {
      this.isLoading = true
      this.error = null

      try {
        const response = await apiService.projects.get(tag);
        if (response.data) {
          this.projects = response.data;
        }
      } catch (err: any) {
        this.error = err.message || 'An unknown error occurred'
        console.error(err)
      } finally {
        this.isLoading = false
      }
    },

    async setCurrentProjectId(projectId: ID | null): Promise<void> {
      this.currentProjectId = projectId;
    },

    async uploadRepositoryFiles(files: File[]) {
      if (!this.currentProjectId) {
        console.warn("No current project selected. Cannot upload files.");
        return;
      }

      const formData = new FormData();
      for (const file of files) {
        formData.append('files', file);
      }

      try {
        const response = await apiService.projects.files.upload(this.currentProjectId, formData);
        if (response.data) {
          return response.data;
        } else {
          console.warn('No data returned from file upload API');
        }
      } catch (err: any) {
        this.error = err.message || 'An unknown error occurred'
        console.error(err)
      }
    }
  }
})
