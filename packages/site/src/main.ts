import { createApp } from 'vue';
import ExampleBlock from '@pizza/example-block';
import App from './App.vue';
import createSiteRouter from './route';
import { baseRoute } from './route/routes';

const app = createApp(App);
const router = createSiteRouter([
  ...baseRoute,
]);
app.use(router);
app.component('ExampleBlock', ExampleBlock);

router.isReady().then(() => {
  app.mount('#app');
});
