// plugins/vuetify.js
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css'; // Importa los iconos de Material Design

export default createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'light', // Puedes cambiar a 'dark' si prefieres un tema oscuro
    },
});