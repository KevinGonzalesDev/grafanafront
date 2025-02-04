<template>
    <div>
        <v-progress-circular indeterminate color="primary" v-if="loading" class="loading">
            <span>Cargando...</span>
        </v-progress-circular>
        <v-row>
            <v-col cols="12" class="d-flex justify-center mt-10">
                <h2>Formulario de Disparadores LLE1001</h2>
            </v-col>

            <v-col cols="12" class="d-flex justify-end">
                <v-btn @click="showForm = true" size="small" prepend-icon="mdi-plus" color="primary">
                    Agregar
                </v-btn>
            </v-col>
            <v-form ref="form" @submit.prevent="sendDatapush">
                <v-dialog v-model="showForm" width="auto">
                    <v-card max-width="800" prepend-icon="mdi-alarm-light" title="Crear nuevo disparador">
                        <v-card-text>
                            <v-row dense>
                                <v-col cols="12" md="6">
                                    <v-text-field v-model="nuevoDisparador.name" label="Nombre">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" md="4">
                                    <v-text-field v-model="nuevoDisparador.code" label="codigo" type="number">
                                    </v-text-field>
                                </v-col>
                                <v-col cols="12" md="2">
                                    <v-text-field v-model="nuevoDisparador.value" type="number" label="disparador">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                            <v-card-actions class="d-flex justify-end">
                                <v-btn color="primary" @click="sendDatapush(nuevoDisparador)">Guardar</v-btn>
                            </v-card-actions>
                        </v-card-text>
                    </v-card>
                </v-dialog>
            </v-form>
            <v-col cols="12">
                <v-container>
                    <v-form ref="form" @submit.prevent="sendData">
                        <v-row dense cols="12" v-for="item in transformedData" align-self="center" :key="item.id">
                            <v-col cols="8" class="d-flex justify-center align-center">
                                {{ item.name }}
                            </v-col>
                            <v-col cols="2" class="d-flex justify-center align-center">
                                <v-chip label color="primary">
                                    {{ item.code }}
                                </v-chip>
                            </v-col>
                            <v-col cols="2" class="d-flex justify-center align-center">
                                <v-text-field dense v-model.number="item.value" type="number">
                                </v-text-field>
                            </v-col>
                        </v-row>
                        <v-row dense>
                            <v-col cols="12" class="d-flex justify-end">
                                <v-btn color="primary" type="submit">Enviar</v-btn>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-container>
            </v-col>
        </v-row>
        <v-alert v-if="statusMessage" :type="statusType" class="mt-5">
            {{ statusMessage }}
        </v-alert>
    </div>
</template>

<script>
import { ref, reactive, onMounted } from "vue";

export default {
    name: "DisparadoresForm",
    data: () => {
        const loading = ref(false);
        const statusMessage = ref("");
        const statusType = ref("success");
        const transformedData = ref([]);
        const nuevoDisparador = ref({
            id: null,
            code: null,
            value: null,
            name: "",
        });
        const showForm = ref(false);

        const fetchData = async () => {
            loading.value = true;
            statusMessage.value = "";
            transformedData.value = [];

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
                        transformedData.value = data;
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

        const sendData = async () => {
            try {
                loading.value = true;
                statusMessage.value = "";


                if (!Array.isArray(transformedData.value) || transformedData.value.length === 0) {
                    throw new Error("No hay datos válidos para enviar.");
                }

                const username = "admin";
                const password = "751156";
                const credentials = btoa(`${username}:${password}`);

                const response = await fetch("http://localhost:4002/api/v1/LINEA10/disparadores/submit", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Basic ${credentials}`,
                    },
                    body: JSON.stringify(transformedData.value), // Convertir datos a JSON
                });



                if (response.ok) {
                    statusMessage.value = "Disparadores actualizados correctamente.";
                    statusType.value = "success";
                } else {
                    // Obtener el mensaje de error del servidor
                    const errorText = await response.text();
                    throw new Error(`Error al actualizar los datos: ${response.status} - ${errorText}`);
                }
            } catch (error) {
                console.error("Error al enviar datos:", error);
                statusMessage.value = error.message || "Error al conectar con el servidor.";
                statusType.value = "error";
            } finally {
                loading.value = false; // Desactivar estado de carga
            }
        };

        const sendDatapush = async () => {

            try {
                if (!nuevoDisparador.value.code || !nuevoDisparador.value.value || !nuevoDisparador.value.name) {
                    alert("Todos los campos son obligatorios.");
                    return;
                }

                // Generar ID automáticamente
                const nuevoId = Date.now(); // O usar `transformedData.value.length + 1` si es seguro

                const disparadorAEnviar = {
                    id: nuevoId,
                    code: parseInt(nuevoDisparador.value.code),
                    value: parseInt(nuevoDisparador.value.value),
                    name: nuevoDisparador.value.name,
                };

                const username = "admin";
                const password = "751156";
                const credentials = btoa(`${username}:${password}`);

                const response = await fetch("http://localhost:4002/api/v1/LINEA10/disparadores/submit", {
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
                    showForm.value = false;
                    nuevoDisparador.value = { id: null, code: null, value: null, name: "" }; // Limpiar formulario
                } else {
                    const errorText = await response.text();
                    throw new Error(`Error al agregar el disparador: ${response.status} - ${errorText}`);
                }
            } catch (error) {
                console.error("Error al agregar disparador:", error);
                alert("Error al conectar con el servidor.");
            }
        };

        onMounted(fetchData);

        return { loading, showForm, nuevoDisparador, sendData, sendDatapush, statusMessage, transformedData, statusType };
    },
};
</script>