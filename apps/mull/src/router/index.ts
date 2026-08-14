import LandingPage from '@/components/pages/LandingPage.vue';
import MainPage from '@/components/pages/MainPage.vue';
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
        path: ':id/',
        name: 'MainPage',
        component: MainPage
      },
      {
        path: ':id/repository/',
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