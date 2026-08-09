import RoutePage from '@/components/pages/RoutePage.vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/projects/',
    name: 'RoutePage',
    component: RoutePage,
    children: [
      // {
      //   path: '',
      //   name: 'ProjectPage',
      //   component: ProjectPage
      // },
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;