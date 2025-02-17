<template>
  <v-app>
    <v-container>
      <v-card>
        <v-card-text>
          <v-tabs v-model="tab" align-tabs="center" color="primary">
            <v-tab value="1">Disparadores</v-tab>
            <v-tab value="2">Plan de reacción</v-tab>
            <!-- <v-tab :value="3">A</v-tab> -->
          </v-tabs>


          <v-tabs-window v-model="tab">
            <v-tabs-window-item value="1">
              <disparadores />
            </v-tabs-window-item>
            <v-tabs-window-item value="2">
              <planreactVue />
            </v-tabs-window-item>
          </v-tabs-window>
        </v-card-text>


      </v-card>

    </v-container>

  </v-app>
</template>

<script>
import { ref, reactive, onMounted } from "vue";
import planreactVue from './components/planreact.vue';
import disparadores from './components/disparadores.vue';


export default {
  components: {
    planreactVue,
    disparadores
  },
  data: () => {
    return {
      tab: ref(0)
    }
  },
}

</script>
