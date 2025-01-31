import { createApp } from 'vue'
import './style.css'
import vuetify from '../plugins/vuetify';
import App from './App.vue'

const app = createApp(App);
app.use(vuetify); // Usa Vuetify
app.mount('#app');
