import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import createDemoRouter from './route';

const app = createApp(App);
const router = createDemoRouter(app, [{
  name: 'base',
  path: '/',
  component: () => import('./App.vue'),
}, {
  name: 'mdtest',
  path: '/test',
  component: () => import('../../pizza-site-parser/__test__/index.demo-entry.md'),
}]);
app.use(router);

router.isReady().then(() => {
  app.mount('#app');
});
