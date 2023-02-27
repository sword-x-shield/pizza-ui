import { createApp } from 'vue';
import ExampleBlock from '@pizza/example-block';
import pizza from 'pizza-ui';
import 'pizza-ui/components/index.scss';
import 'pizza-ui/_styles/index.scss';
import App from './App.vue';
import createSiteRouter from './route';
import { baseRoute } from './route/routes';

const app = createApp(App);
const router = createSiteRouter([
  ...baseRoute,
]);
app.use(router);
app.use(pizza);
app.component('ExampleBlock', ExampleBlock);

router.isReady().then(() => {
  app.mount('#app');
});
