import InitiationPage from '@/components/pages/InitiationPage.vue';
import ExplorationPage from '@/components/pages/ExplorationPage.vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';


export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'InitiationPage',
    component: InitiationPage
  },
  {
    path: '/exploration',
    name: 'ExplorationPage',
    component: ExplorationPage
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;