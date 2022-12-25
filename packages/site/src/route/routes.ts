import { RouteRecordRaw } from 'vue-router';
export const baseRoute: Array<RouteRecordRaw> = [{
  name: 'homePage',
  path: '/',
  component: () => import('@/views/homepage/index.vue'),
}, {
  name: 'components',
  path: '/components',
  redirect: '/components/anchor',
  component: () => import('@/components/siteLayout.vue'),
  children: [
    {
      name: 'anchor',
      path: 'anchor',
      component: () => import('pizza-ui/components/anchor/example/index.entry.md'),
    },
    {
      name: 'affix',
      path: 'affix',
      component: () => import('pizza-ui/components/affix/example/index.entry.md'),
    },
  ],
},
];
