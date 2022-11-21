import { createRouter, createWebHistory } from 'vue-router';

export const loadingBarApiRef = {};

export default function createDemoRouter(app, routes) {
  const router = createRouter({
    history: createWebHistory(),
    routes,
  });

  return router;
}
