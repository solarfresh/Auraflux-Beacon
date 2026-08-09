import RoutePage from '@/components/pages/RoutePage.vue';
import MainPage from '@/components/pages/MainPage.vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/projects/',
    name: 'RoutePage',
    component: RoutePage,
    children: [
      {
        path: '',
        name: 'MainPage',
        component: MainPage
      },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;