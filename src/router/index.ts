import SearchPage from '@/components/pages/SearchPage.vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';


export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'SearchPage',
    component: SearchPage
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;