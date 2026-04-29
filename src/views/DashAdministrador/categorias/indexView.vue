<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center p-4">
    <div class="w-full max-w-2xl bg-white rounded-2xl shadow-xl p-6">
      <h2 class="text-2xl font-bold text-gray-800 mb-6">Crear Categoría de Liga</h2>

      <form @submit.prevent="submitForm" class="space-y-4">
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-600">Nombre</label>
          <input
            v-model="form.nombre"
            type="text"
            required
            class="mt-1 w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Ej. Sub-20, Primera División"
          />
        </div>

        <!-- Estatus -->
        <div>
          <label class="block text-sm font-medium text-gray-600">Estatus</label>
          <select
            v-model="form.estatus"
            class="mt-1 w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <!-- Liga -->
        <div>
          <label class="block text-sm font-medium text-gray-600">Liga</label>
          <select
            v-model="form.id_liga"
            required
            class="mt-1 w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option disabled value="">Selecciona una liga</option>
            <option
              v-for="liga in ligas"
              :key="liga.id"
              :value="liga.id"
            >
              {{ liga.nombre }}
            </option>
          </select>
        </div>

        <!-- Botón -->
        <div class="pt-4">
          <button
            type="submit"
            class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition"
          >
            Guardar Categoría
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const form = ref({
  nombre: "",
  estatus: "activo",
  id_liga: "",
});

const ligas = ref([]);

// 🔽 Obtener ligas desde API
const fetchLigas = async () => {
  try {
    const res = await axios.get("/api/ligas");
    ligas.value = res.data;
  } catch (error) {
    console.error("Error cargando ligas", error);
  }
};

// 🔽 Enviar formulario
const submitForm = async () => {
  try {
    const payload = {
      Nombre: form.value.nombre,
      Estatus: form.value.estatus,
      Id_Liga: form.value.id_liga,
    };

    await axios.post("/api/categorias", payload);

    alert("Categoría creada correctamente");

    form.value = {
      nombre: "",
      estatus: "activo",
      id_liga: "",
    };
  } catch (error) {
    console.error("Error al guardar", error);
  }
};

onMounted(fetchLigas);
</script>

<style scoped>
/* Responsive tweaks */
@media (max-width: 640px) {
  .max-w-2xl {
    max-width: 100%;
  }
}
</style>