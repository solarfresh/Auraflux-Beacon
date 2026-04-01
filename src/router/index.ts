import AgentSettingsPage from '@/components/pages/AgentSettingsPage.vue';
import ExplorationPage from '@/components/pages/ExplorationPage.vue';
import InitiationPage from '@/components/pages/InitiationPage.vue';
import ISearchPage from '@/components/pages/ISearchPage.vue';
import LandingPage from '@/components/pages/LandingPage.vue';
import ProjectPage from '@/components/pages/ProjectPage.vue';
import AgentEditorPage from '@/components/pages/AgentEditorPage.vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';


export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage
  },
  {
    path: '/isearch/',
    name: 'ISearchPage',
    component: ISearchPage,
    children: [
      {
        path: '',
        name: 'ProjectPage',
        component: ProjectPage
      },
      {
        path: ':id/initiation/',
        name: 'InitiationPage',
        component: InitiationPage
      },
      {
        path: ':id/exploration/',
        name: 'ExplorationPage',
        component: ExplorationPage
      },
    ]
  },
  {
    path: '/settings/',
    name: 'SettingsPage',
    component: ISearchPage,
    children: [
      {
        path: 'agents',
        name: 'AgentSettingsPage',
        component: AgentSettingsPage
      },
      {
        path: 'agents/:id/',
        name: 'AgentEditorPage',
        component: AgentEditorPage
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;