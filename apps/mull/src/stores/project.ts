import { defineStore } from 'pinia';
import { apiService } from '@/api/apiService';
// import type { ID } from '@auraflux/design-system/interfaces/core';
import type { Project } from '@/interfaces/project'

interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  isLoading: boolean;
  error: string | null;
};

export const useProjectStore = defineStore('project', {
  state: (): ProjectState => ({
    projects: [],
    currentProject: null,
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
    }
  }
})
