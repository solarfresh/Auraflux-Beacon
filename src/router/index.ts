import InitiationPage from '@/components/pages/InitiationPage.vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';


export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'InitiationPage',
    component: InitiationPage
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;