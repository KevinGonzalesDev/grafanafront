<template>
  <v-app>
    <v-container>
      <v-progress-circular indeterminate color="primary" v-if="loading" class="loading">
        <span>Cargando...</span>
      </v-progress-circular>

      <h1>Formulario de Disparadores LLE1001</h1>
      esta es la data =
      {{ transformedData }}
      <v-row>
        <v-col cols="4" class="labels-section">
          <div v-for="label in labels" :key="label" class="label-item">
            {{ label }}
          </div>
        </v-col>
        <v-col cols="8">
          <v-form ref="form" @submit.prevent="sendData">
            <v-row dense>
              <v-col cols="12" sm="6" md="4" v-for="(value, key) in formData" :key="key">
                <v-text-field :label="key" :id="key" :name="key" v-model="formData[key]" type="number" required />
              </v-col>
            </v-row>
            <v-btn color="primary" type="submit">Enviar</v-btn>
          </v-form>
        </v-col>
      </v-row>
      <v-alert v-if="statusMessage" :type="statusType" class="mt-5">
        {{ statusMessage }}
      </v-alert>
    </v-container>
  </v-app>
</template>

<script>
import { ref, reactive, onMounted } from "vue";

export default {
  name: "DisparadoresForm",
  setup() {
    const loading = ref(false);
    const statusMessage = ref("");
    const statusType = ref("success");
    const transformedData = ref([]);
    const labels = [
      "ENVASE CAIDO EN LA RUEDA HELICOIDAL #1",
      "FALTA DE ENVASES A LA CÓCLEA #1",
      "SEGURIDAD INSPECTOR DE ENVASES LLENOS",
      "BLOQUEO ENVASES A LA CINTA DE SALIDA",
      "BLOQUE DE ALIMENTACIÓN CAPSULAS",
      "CERRADORA - FALLO CONTROL ENVASE",
      "CERRADORA - FALLO CONTROL DEL GAS",
      "BLOQUEO ENVASES A LA CINTA DE INGRESO",
      "CERRADORA - FALLO 36 INGRESO ENVASES (4360S8)",
      "CERRADORA - FALLO 34 EMBRAGUE ESTRELLA DE SALIDA (4360S6)",
      "ALARMA EYECTOR DE ENVASES - PARADA ENVASES",
      "CINTA DE ENTRADA #1 - NO EN MARCHAS",
      "SEGURIDAD EXPULSAR ENVASE (DEMASIADOS ENVASES EYECTADOS)",
    ];

    const formData = reactive({
      604620: null,
      604618: null,
      604645: null,
      604637: null,
      604734: null,
      605570: null,
      605580: null,
      604626: null,
      605537: null,
      605535: null,
      604011: null,
      604629: null,
      604012: null,
    });

    const fetchData = async () => {
      loading.value = true;
      statusMessage.value = "";
      transformedData = []
      try {
        const username = "admin";
        const password = "751156";
        const credentials = btoa(`${username}:${password}`);

        const response = await fetch(
          "http://localhost:4002/api/v1/LINEA10/disparadores/data",
          {
            method: "GET",
            headers: {
              Authorization: `Basic ${credentials}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          transformedData = data
          console.log(data)
          Object.assign(formData, data);
        } else {
          throw new Error(`Error al obtener los datos: ${response.status}`);
        }
      } catch (error) {
        statusMessage.value = error.message || "Error al conectar con el servidor.";
        statusType.value = "error";
      } finally {
        loading.value = false;
      }
    };

    const sendData = async () => {
      try {
        const username = "admin";
        const password = "751156";
        const credentials = btoa(`${username}:${password}`);

        const response = await fetch(
          "http://localhost:4002/api/v1/LINEA10/disparadores/submit",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Basic ${credentials}`,
            },
            body: JSON.stringify(formData),
          }
        );

        if (response.ok) {
          statusMessage.value = "Disparadores actualizados correctamente.";
          statusType.value = "success";
        } else {
          throw new Error("Error al actualizar los datos.");
        }
      } catch (error) {
        statusMessage.value = error.message || "Error al conectar con el servidor.";
        statusType.value = "error";
      }
    };

    onMounted(fetchData);

    return { loading, labels, formData, sendData, statusMessage, statusType };
  },
};
</script>

<style>
.labels-section .label-item {
  margin-bottom: 10px;
}

.loading {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1000;
}
</style>
