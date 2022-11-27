import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';

export const loadingBarApiRef = {};

export default function createSiteRouter(routes: Array<RouteRecordRaw>) {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  return router;
}
