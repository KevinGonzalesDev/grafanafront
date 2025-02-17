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
          Agregar
        </v-btn>
        <v-form ref="form">
          <v-dialog v-model="showModal" width="auto">
            <v-card max-width="800" prepend-icon="mdi-alarm-light" title="Crear nuevo plan de reacción">
              <v-card-text>
                <v-row dense>
                  <v-col cols="12" md="12">
                    <v-text-field v-model="nuevoplan.name" label="Nombre del plan">
                    </v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-combobox v-model="nuevoplan.linea" label="Linea"
                      :items="['Linea 1', 'Linea 2', 'Linea 6', 'Linea 10']"
                      :v-on:change="fetchDataFilter(nuevoplan.linea)"></v-combobox>
                  </v-col>
                  <v-col cols="12" md="8">
                    <v-autocomplete :disabled="dislistDisabled" v-model="nuevoplan.code" :items="distlistFilter"
                      color="blue-grey-lighten-2" item-title="name" item-value="code" label="Disparador relacionado"
                      chip>
                      <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props" :title="item.raw.name">
                          <template v-slot:prepend>
                            <v-chip left>{{ item.raw.code }}</v-chip>
                          </template>
                        </v-list-item>
                      </template>
                    </v-autocomplete>
                  </v-col>
                  <v-col cols="12" class="d-flex">
                    <h5>Planes de reacción</h5>
                    <v-spacer />
                    <v-btn color="primary" size="small" prepend-icon="mdi-plus"
                      @click="agregarDisparador()">Agregar</v-btn>
                  </v-col>

                  <v-col cols="12" v-for="(item, index) in disparadoresArray" :key="index">
                    <v-text-field hide-details v-model="disparadoresArray[index]">
                      <template v-slot:append>
                        <v-btn variant="plain" icon="mdi-delete" size="xsmall" color="red"
                          @click="eliminarDisparador(index)"></v-btn>
                      </template>
                    </v-text-field>
                  </v-col>

                </v-row>
                <v-card-actions class="d-flex justify-end">
                  <v-btn color="primary" size="small" @click="sendDatapush()">Guardar</v-btn>
                </v-card-actions>
              </v-card-text>
            </v-card>
          </v-dialog>
        </v-form>
      </v-col>

    </v-row>

    <v-row dense>

      <v-col cols="12" md="6" v-for="item in Distlistplan" :key="item.id">
        <v-card outlined>
          <template v-slot:title>
            <v-card-title class="bg-grey-lighten-4  d-flex justify-center align-center">
              <a class="text-subtitle-1">{{ item.name }}</a>
              <v-spacer />
              <v-chip label class="mr-2" color="secondary">
                {{ item.linea }}
              </v-chip>
              <v-chip label color="primary">
                <v-icon start icon="mdi-alarm-light" />
                {{ item.code }}
              </v-chip>
            </v-card-title>
          </template>
          <v-card-text>
            <v-list density="compact" lines="one">
              <v-list-item v-for="(plan, i) in item.plan" :key="i">
                <v-list-item-title class="text-caption text-wrap">
                  {{ plan }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

  </div>
</template>
<script>
import { ref } from "vue";

export default {

  setup() {
    const showModal = ref(false);
    const loading = ref(false);
    const statusMessage = ref("");

    const disList = ref([])
    const dislistDisabled = ref(true);
    const distlistFilter = ref([])

    const Distlistplan = ref([])
    const planList = ref([])
    const disparadoresArray = ref([]);
    const nuevoplan = ref({
      id: null,
      linea: "",
      code: null,
      name: "",
      plan: [],
    });



    const agregarDisparador = () => {
      disparadoresArray.value.push("");
    };

    const eliminarDisparador = (index) => {
      disparadoresArray.value.splice(index, 1); // Elimina el campo en la posición index
    };

    const fetchDataFilter = async (selectedLinea) => {
      try {
        dislistDisabled.value = false;
        distlistFilter.value = disList.value.filter((item) => {
          return item.linea === selectedLinea; // Comparar campo "linea" con el valor seleccionado
        });

        console.log("Datos filtrados:", distlistFilter.value);
      } catch (error) {
        console.error("Error al filtrar los datos:", error);
      }

    }

    const fetchData = async () => {
      loading.value = true;
      disList.value = [];

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
          try {
            const data = await response.json();
            disList.value = data;
          } catch (jsonError) {
            console.error("Error al procesar el cuerpo de la respuesta:", jsonError);
            throw new Error("Error al procesar los datos del servidor.");
          }
        } else {
          const errorText = await response.text();
          throw new Error(`Error al obtener los datos: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error("Error en fetchData:", error);
        statusMessage.value = error.message || "Error al conectar con el servidor.";
        statusType.value = "error";
      } finally {
        loading.value = false;

      }
    };


    const fetchplanData = async () => {
      loading.value = true;
      statusMessage.value = "";
      Distlistplan.value = [];

      try {
        const username = "admin";
        const password = "751156";
        const credentials = btoa(`${username}:${password}`);

        const response = await fetch(
          "http://localhost:4002/api/v1/LINEA/plansic/data",
          {
            method: "GET",
            headers: {
              Authorization: `Basic ${credentials}`,
            },
          }
        );
        if (response.ok) {
          try {
            const data = await response.json();
            Distlistplan.value = data;
          } catch (jsonError) {
            console.error("Error al procesar el cuerpo de la respuesta:", jsonError);
            throw new Error("Error al procesar los datos del servidor.");
          }
        } else {
          const errorText = await response.text();
          throw new Error(`Error al obtener los datos: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error("Error en fetchData:", error);
        statusMessage.value = error.message || "Error al conectar con el servidor.";
        statusType.value = "error";
      } finally {
        loading.value = false;
      }

    }

    const sendDatapush = async () => {
      const nuevoId = Date.now();
      const disparadorAEnviar = {
        id: nuevoId,
        linea: nuevoplan.value.linea,
        code: parseInt(nuevoplan.value.code),
        name: nuevoplan.value.name,
        plan: disparadoresArray.value,
      };

      try {
        if (!nuevoplan.value.linea || !nuevoplan.value.code || !nuevoplan.value.name || !nuevoplan.value.plan) {
          alert("Todos los campos son obligatorios.");
          return;
        }
        const username = "admin";
        const password = "751156";
        const credentials = btoa(`${username}:${password}`);

        const response = await fetch("http://localhost:4002/api/v1/LINEA/plansic/submit", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${credentials}`,
          },
          body: JSON.stringify(disparadorAEnviar), // Enviar solo el nuevo objeto
        }); // Enviar el objeto completo
        console.log(response, 'respuesta del server');


        if (response.ok) {
          alert("Disparador agregado correctamente.");
          showModal.value = false;
          nuevoplan.value = {
            id: null, code: null, linea: null, plan: [], name: ""
          }; // Limpiar formulario
        } else {
          const errorText = await response.text();
          throw new Error(`Error al agregar el disparador: ${response.status} - ${errorText}`);
        }
      } catch (error) {
        console.error("Error al agregar disparador:", error);
        alert("Error al conectar con el servidor.");
      } finally {
        fetchplanData()
      }
    };


    return {
      statusMessage,
      loading,
      planList,
      fetchplanData,
      fetchData,
      Distlistplan,
      showModal,
      nuevoplan,
      fetchDataFilter,
      dislistDisabled,
      disList,
      agregarDisparador, eliminarDisparador, disparadoresArray,
      sendDatapush
    };
  },

  mounted() {
    this.fetchplanData();
    this.fetchData();
  },

}
</script>