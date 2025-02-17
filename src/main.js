import { createApp } from 'vue'
import vuetify from '../plugins/vuetify';
import 'vuetify/styles';
import App from './App.vue'

const app = createApp(App);
app.use(vuetify); // Usa Vuetify
app.mount('#app');
