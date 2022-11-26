import { createApp } from 'vue';
import App from './App.vue';
import createSiteRouter from './route';
import { baseRoute } from './route/routes';

const app = createApp(App);
const router = createSiteRouter([
  ...baseRoute,
]);
app.use(router);

router.isReady().then(() => {
  app.mount('#app');
});
