<template>
  <div>
    <v-row>
      <v-col cols="12" class="d-flex justify-center">
        <h2 class="mt-10">
          Formulario del plan Sic's
        </h2>
      </v-col>
      <v-col cols="!2" class="d-flex justify-end">
        <v-btn color="primary" size="small" prepend-icon="mdi-plus" @click="showModal = true">
          Añadir
        </v-btn>
      </v-col>

    </v-row>

    <v-row dense>
      <v-col cols="12">
      </v-col>
      <v-col>
        listado de plans sics
      </v-col>
    </v-row>

  </div>
</template>
<script>
import { ref } from "vue";
export default {


  data: () => {
    const showModal = ref(false);

  }
}
</script>