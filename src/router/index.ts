import InitiationPage from '@/components/pages/InitiationPage.vue';
import LandingPage from '@/components/pages/LandingPage.vue';
import ExplorationPage from '@/components/pages/ExplorationPage.vue';
import ISearchPage from '@/components/pages/ISearchPage.vue';
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