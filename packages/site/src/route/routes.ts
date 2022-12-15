import { RouteRecordRaw } from 'vue-router';
export const baseRoute: Array<RouteRecordRaw> = [{
  name: 'homePage',
  path: '/',
  component: () => import('@/views/homepage/index.vue'),
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
    {
      name: 'anchor',
      path: 'anchor',
      component: () => import('../../../pizza-ui/src/components/anchor/example/index.entry.md'),
    },
  ],
},
];
