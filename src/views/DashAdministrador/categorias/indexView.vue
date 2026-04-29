<template>
  <div class="page">
    <!-- CARD -->
    <div class="card">
      <!-- HEADER -->
      <div class="header">
        <h2>⚽ Crear Categoría</h2>
        <p>Asigna una categoría a una liga existente</p>
      </div>

      <!-- FORM -->
      <form @submit.prevent="submitForm" class="form">
        <!-- NOMBRE -->
        <div class="input-group">
          <input v-model="form.nombre" required />
          <label>Nombre de la categoría</label>
        </div>

        <!-- ESTATUS -->
        <div class="select-group">
          <label>Estatus</label>
          <select v-model="form.estatus">
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <!-- LIGA -->
        <div class="select-group">
          <label>Seleccionar Liga</label>
          <select v-model="form.id_liga" required>
            <option disabled value="">Selecciona una liga</option>
            <option v-for="liga in ligas" :key="liga.Id" :value="liga.Id">
              {{ liga.Nombre }}
            </option>
          </select>
        </div>

        <!-- BUTTON -->
        <button :disabled="loading">
          <span v-if="!loading">Guardar Categoría</span>
          <span v-else>Guardando...</span>
        </button>
      </form>

      <!-- ERROR -->
      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const API =
  "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";

const form = ref({
  nombre: "",
  estatus: "activo",
  id_liga: "",
});

const ligas = ref([]);
const loading = ref(false);
const error = ref("");

// 🔽 Obtener ligas
const fetchLigas = async () => {
  try {
    const res = await axios.get(`${API}/api/ligas`);

    console.log(res.data.data); // 👈 DEBUG

    ligas.value = res.data.data; // ✅ AQUÍ ESTÁ LA CLAVE
  } catch (err) {
    console.error(err);
    error.value = "Error cargando ligas";
  }
};

// 🔽 Enviar
const submitForm = async () => {
  loading.value = true;
  error.value = "";

  try {
    await axios.post(`${API}/api/categorias`, {
      Nombre: form.value.nombre,
      Estatus: form.value.estatus,
      Id_Liga: form.value.id_liga,
    });

    alert("✅ Categoría creada");

    form.value = {
      nombre: "",
      estatus: "activo",
      id_liga: "",
    };
  } catch (err) {
    error.value = "Error al guardar";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchLigas);
</script>

<style scoped>
/* 🌌 BACKGROUND */
.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #1e293b, #6366f1);
  padding: 20px;
}

/* 💎 CARD */
.card {
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 30px;
  color: white;
  box-shadow: 0 0 40px rgba(99, 102, 241, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* 🧠 HEADER */
.header h2 {
  font-size: 24px;
  margin-bottom: 5px;
  color: #c7d2fe;
}

.header p {
  font-size: 13px;
  color: #cbd5f5;
  margin-bottom: 20px;
}

/* 📦 FORM */
.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* ✍ INPUT FLOAT */
.input-group {
  position: relative;
}

.input-group input {
  width: 100%;
  padding: 12px;
  border: none;
  border-bottom: 2px solid #818cf8;
  background: transparent;
  color: white;
  outline: none;
}

.input-group label {
  position: absolute;
  top: 12px;
  left: 0;
  font-size: 14px;
  color: #a5b4fc;
  transition: 0.3s;
}

.input-group input:focus + label,
.input-group input:valid + label {
  top: -10px;
  font-size: 12px;
  color: #6366f1;
}

/* 📥 SELECT */
.select-group label {
  font-size: 13px;
  color: #cbd5f5;
}

.select-group select {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  background: #1e293b;
  color: white;
  outline: none;
}

/* 🚀 BUTTON */
button {
  margin-top: 10px;
  padding: 14px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ❌ ERROR */
.error {
  margin-top: 10px;
  color: #f87171;
  font-size: 13px;
}

/* 📱 RESPONSIVE */
@media (max-width: 500px) {
  .card {
    padding: 20px;
  }

  .header h2 {
    font-size: 20px;
  }
}
</style>
