import AgentBenchPage from '@/components/pages/AgentBenchPage.vue';
import LandingPage from '@/components/pages/LandingPage.vue';
import MainPage from '@/components/pages/MainPage.vue';
import ModelProviderPage from '@/components/pages/ModelProviderPage.vue';
import ProjectPage from '@/components/pages/ProjectPage.vue';
import RepositoryPage from '@/components/pages/RepositoryPage.vue';
import RoutePage from '@/components/pages/RoutePage.vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage
  },
  {
    path: '/projects/',
    name: 'RoutePage',
    component: RoutePage,
    children: [
      {
        path: '',
        name: 'ProjectPage',
        component: ProjectPage
      },
      {
        path: ':projectId/',
        name: 'MainPage',
        component: MainPage
      },
      {
        path: ':projectId/agents/',
        name: 'AgentBenchPage',
        component: AgentBenchPage
      },
      {
        path: ':projectId/repository/',
        name: 'RepositoryPage',
        component: RepositoryPage
      }
    ]
  },
  {
    path: '/settings/',
    name: 'SettingsPage',
    component: RoutePage,
    children: [
      {
        path: 'models/',
        name: 'ModelProviderPage',
        component: ModelProviderPage
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;