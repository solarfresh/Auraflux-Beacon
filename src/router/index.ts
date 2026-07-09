import AgentEditorPage from '@/components/pages/AgentEditorPage.vue';
import AgentSettingsPage from '@/components/pages/AgentSettingsPage.vue';
import ExplorationPage from '@/components/pages/ExplorationPage.vue';
import ConsultationPage from '@/components/pages/ConsultationPage.vue';
import LandingPage from '@/components/pages/LandingPage.vue';
import MainPage from '@/components/pages/MainPage.vue';
import ModelProviderSettingsPage from '@/components/pages/ModelProviderSettingsPage.vue';
import ProjectPage from '@/components/pages/ProjectPage.vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';


export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage
  },
  {
    path: '/projects/',
    name: 'MainPage',
    component: MainPage,
    children: [
      {
        path: '',
        name: 'ProjectPage',
        component: ProjectPage
      },
      {
        path: ':id/consultation/',
        name: 'ConsultationPage',
        component: ConsultationPage
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
    component: MainPage,
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
      {
        path: 'models',
        name: 'ModelProviderSettingsPage',
        component: ModelProviderSettingsPage
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;