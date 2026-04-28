<template>
  <div class="container">
    <div class="card">
      
      <!-- 🔙 BACK -->
      <router-link to="/dashboard/dashboardMasterAdmin" class="btn-back">
        ⬅ Volver a Administradores
      </router-link>

      <!-- TITLE -->
      <h1>👤 Crear Administrador</h1>
      <p class="subtitle">Registra un nuevo administrador del sistema</p>

      <!-- FORM -->
      <form @submit.prevent="crearAdmin">

        <div class="form-grid">
          <input v-model="admin.Correo" placeholder="Correo electrónico" required />

          <input v-model="admin.Celular" placeholder="Celular" />

          <input 
            v-model="admin.Password" 
            type="password" 
            placeholder="Contraseña" 
            required 
          />

          <!-- SELECT LIGA -->
          <select v-model="admin.Id_Ligas">
            <option value="">Seleccionar Liga</option>
            <option v-for="liga in ligas" :key="liga.Id" :value="liga.Id">
              {{ liga.Nombre }}
            </option>
          </select>

          <!-- STATUS -->
          <select v-model="admin.Estatus">
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <!-- BUTTON -->
        <button :disabled="loading">
          {{ loading ? "Creando..." : "Crear Administrador" }}
        </button>
      </form>

      <!-- MENSAJES -->
      <p class="error" v-if="error">{{ error }}</p>
      <p class="success" v-if="success">{{ success }}</p>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const API = "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";

const admin = ref({
  Celular: "",
  Id_Ligas: "",
  Estatus: "Activo",
  Password: "",
  Correo: ""
});

const ligas = ref([]);

const loading = ref(false);
const error = ref("");
const success = ref("");

// 🔥 CARGAR LIGAS
const fetchLigas = async () => {
  try {
    const res = await axios.get(`${API}/api/ligas`);
    if (res.data.ok) {
      ligas.value = res.data.data;
    }
  } catch (err) {
    console.error(err);
  }
};

// 🚀 CREAR ADMIN
const crearAdmin = async () => {
  error.value = "";
  success.value = "";
  loading.value = true;

  if (!admin.value.Correo || !admin.value.Password) {
    error.value = "Correo y contraseña son obligatorios";
    loading.value = false;
    return;
  }

  try {
    const res = await axios.post(`${API}/api/admins`, admin.value);

    if (res.data.ok) {
      success.value = "✅ Administrador creado correctamente";

      admin.value = {
        Celular: "",
        Id_Ligas: "",
        Estatus: "Activo",
        Password: "",
        Correo: ""
      };
    } else {
      error.value = res.data.error;
    }

  } catch (err) {
    console.error(err);
    error.value = "Error al crear administrador";
  } finally {
    loading.value = false;
  }
};

onMounted(fetchLigas);
</script>

<style scoped>
/* 🌌 BACKGROUND */
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0f172a, #1e3a8a);
  padding: 20px;
}

/* 🧊 CARD */
.card {
  width: 100%;
  max-width: 550px;
  background: rgba(255,255,255,0.06);
  backdrop-filter: blur(20px);
  padding: 25px;
  border-radius: 20px;
  color: white;
}

/* 🔙 BACK BTN */
.btn-back {
  display: inline-block;
  margin-bottom: 15px;
  padding: 8px 12px;
  border-radius: 10px;
  background: #1e293b;
  text-decoration: none;
  color: white;
  font-size: 13px;
  transition: 0.3s;
}
.btn-back:hover {
  background: #334155;
}

/* TITLE */
h1 {
  margin-bottom: 5px;
}

.subtitle {
  font-size: 13px;
  margin-bottom: 20px;
  color: #cbd5f5;
}

/* FORM GRID */
.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 12px;
}

/* INPUTS */
input, select {
  padding: 12px;
  border-radius: 10px;
  border: none;
  outline: none;
}

/* BUTTON */
button {
  margin-top: 15px;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  font-weight: bold;
  cursor: pointer;
}

/* MENSAJES */
.error {
  color: #f87171;
  margin-top: 10px;
}

.success {
  color: #4ade80;
  margin-top: 10px;
}

/* 📱 TABLET */
@media (min-width: 600px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }

  .form-grid input:nth-child(1),
  .form-grid input:nth-child(3) {
    grid-column: span 2;
  }
}

/* 🖥 DESKTOP */
@media (min-width: 900px) {
  .card {
    max-width: 650px;
  }
}
</style>