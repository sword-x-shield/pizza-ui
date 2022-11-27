import { RouteRecordRaw } from 'vue-router';
export const baseRoute: Array<RouteRecordRaw> = [{
  name: 'homePage',
  path: '/',
  component: () => import('@/views/homePage/index.vue'),
}, {
  name: 'components',
  path: '/components',
  redirect: '/components/test',
  component: () => import('@/components/siteLayout.vue'),
  children: [
    {
      name: 'test',
      path: 'test',
      component: () => import('../../../pizza-site-parser/__test__/index.demo-entry.md'),
    },
  ],
}];
