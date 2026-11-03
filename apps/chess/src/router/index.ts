import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import ChessPage from '../components/pages/ChessPage.vue';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: ChessPage,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
