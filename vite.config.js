import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'


export default defineConfig({
  plugins: [vue()],
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "vuetify/lib/styles/main.sass";`, // Importa los estilos de Vuetify
      },
    },
  },
});
// https://vite.dev/config/

