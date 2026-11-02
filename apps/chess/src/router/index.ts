import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import HelloPage from '../components/pages/HelloPage.vue';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HelloPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;