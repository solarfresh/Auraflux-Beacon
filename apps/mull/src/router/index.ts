import MainPage from '@/components/pages/MainPage.vue';
import RepositoryPage from '@/components/pages/RepositoryPage.vue';
import RoutePage from '@/components/pages/RoutePage.vue';
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/projects/:id/',
    name: 'RoutePage',
    component: RoutePage,
    children: [
      {
        path: '',
        name: 'MainPage',
        component: MainPage
      },
      {
        path: 'repository',
        name: 'RepositoryPage',
        component: RepositoryPage
      }
    ]
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;