import { registerPlugins } from '@/plugins';
import App from './App.vue';
import { createApp } from 'vue';
import router from './routes/routes';
import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import '@mdi/font/css/materialdesignicons.css';

const app = createApp(App)

registerPlugins(app);
app.use(router);
app.use(createVuetify());
app.mount('#app');