import ExplorationPage from '@/components/pages/ExplorationPage.vue';
import InitiationPage from '@/components/pages/InitiationPage.vue';
import ISearchPage from '@/components/pages/ISearchPage.vue';
import LandingPage from '@/components/pages/LandingPage.vue';
import ProjectPage from '@/components/pages/ProjectPage.vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';


export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'LandingPage',
    component: LandingPage
  },
  {
    path: '/isearch',
    name: 'ISearchPage',
    component: ISearchPage,
    children: [
      {
        path: '',
        name: 'ProjectPage',
        component: ProjectPage
      },
      {
        path: 'initiation',
        name: 'InitiationPage',
        component: InitiationPage
      },
      {
        path: 'exploration',
        name: 'ExplorationPage',
        component: ExplorationPage
      },
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;