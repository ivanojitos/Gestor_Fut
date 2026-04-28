<template>
  <div class="container">
    <div class="card">
      <!-- 🔙 BOTÓN -->
      <router-link to="/dashboard/dashboardMaster" class="btn-home">
        ⬅ Volver al Dashboard
      </router-link>

      <h1>🏆 Crear Liga</h1>
      <p class="subtitle">Registra una nueva liga</p>

      <form @submit.prevent="crearLiga">
        <!-- LOGO -->
        <div class="logo-upload">
          <img :src="preview || defaultLogo" class="logo-preview" />
          <input type="file" @change="handleFile" />
        </div>

        <!-- INPUTS -->
        <div class="form">
          <input v-model="liga.Nombre" placeholder="Nombre" required />
          <input v-model="liga.Direccion" placeholder="Dirección" />
          <input v-model="liga.Celular" placeholder="Celular" />
        </div>

        <!-- BUTTON -->
        <button :disabled="loading">
          {{ loading ? "Guardando..." : "Crear Liga" }}
        </button>
      </form>

      <!-- MENSAJES -->
      <p class="error" v-if="error">{{ error }}</p>
      <p class="success" v-if="success">{{ success }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

// 🔥 PARSEADOR DE ERRORES
const parseError = (err) => {
  console.log("ERROR COMPLETO:", err);

  if (err.response) {
    const data = err.response.data;

    if (data.error) return data.error;
    if (data.message) return data.message;

    if (Array.isArray(data.errors)) {
      return data.errors.join(", ");
    }

    return "Error del servidor";
  }

  if (err.request) {
    return "No hay conexión con el servidor";
  }

  return err.message || "Error inesperado";
};

// 🔥 STATE
const liga = ref({
  Nombre: "",
  Direccion: "",
  Celular: "",
});

const file = ref(null);
const preview = ref(null);
const defaultLogo = "https://via.placeholder.com/120";

const loading = ref(false);
const error = ref("");
const success = ref("");

// 📸 HANDLE FILE
const handleFile = (e) => {
  const selected = e.target.files[0];
  if (!selected) return;

  file.value = selected;
  preview.value = URL.createObjectURL(selected);
};

// 🚀 CREAR LIGA
const crearLiga = async () => {
  error.value = "";
  success.value = "";
  loading.value = true;

  // VALIDACIÓN FRONT
  if (!liga.value.Nombre || !liga.value.Nombre.trim()) {
    error.value = "El nombre es obligatorio";
    loading.value = false;
    return;
  }

  try {
    const formData = new FormData();

    formData.append("Nombre", liga.value.Nombre.trim());
    formData.append("Direccion", liga.value.Direccion || "");
    formData.append("Celular", liga.value.Celular || "");

    if (file.value) {
      formData.append("Logo", file.value);
    }

    const res = await axios.post(
      "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net/api/ligas",
      formData
    );

    if (res.data.ok) {
      success.value = res.data.message || "✅ Liga creada correctamente";

      // RESET
      liga.value = {
        Nombre: "",
        Direccion: "",
        Celular: "",
      };

      file.value = null;
      preview.value = null;
    } else {
      error.value = res.data.error || "Error al crear liga";
    }
  } catch (err) {
    error.value = parseError(err);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 🌌 CONTENEDOR */
.container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #0f172a, #1e3a8a);
  padding: 15px;
}

/* 🧊 CARD */
.card {
  width: 100%;
  max-width: 500px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  padding: 20px;
  border-radius: 20px;
  color: white;
  text-align: center;
}

/* 🔙 BOTÓN */
.btn-home {
  display: inline-block;
  margin-bottom: 15px;
  padding: 8px 12px;
  border-radius: 10px;
  background: #1e293b;
  color: white;
  text-decoration: none;
  font-size: 13px;
  transition: 0.3s;
}

.btn-home:hover {
  background: #334155;
}

/* TITULO */
h1 {
  margin-bottom: 5px;
}

.subtitle {
  font-size: 13px;
  margin-bottom: 20px;
  color: #cbd5f5;
}

/* LOGO */
.logo-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.logo-preview {
  width: 100px;
  height: 100px;
  border-radius: 15px;
  object-fit: cover;
  margin-bottom: 10px;
  border: 2px solid #3b82f6;
}

/* FORM */
.form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* INPUTS */
input {
  width: 100%;
  box-sizing: border-box;
  padding: 12px;
  border-radius: 10px;
  border: none;
  outline: none;
}

/* BUTTON */
button {
  width: 100%;
  margin-top: 15px;
  padding: 12px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  font-weight: bold;
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

/* 📱 MÓVIL */
@media (max-width: 480px) {
  .card {
    padding: 15px;
  }

  h1 {
    font-size: 20px;
  }

  .subtitle {
    font-size: 12px;
  }

  input {
    padding: 10px;
    font-size: 14px;
  }

  button {
    padding: 10px;
    font-size: 14px;
  }

  .logo-preview {
    width: 80px;
    height: 80px;
  }

  .btn-home {
    font-size: 12px;
    padding: 6px 10px;
  }
}

/* 📱 TABLET */
@media (min-width: 600px) {
  .form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }

  .form input:nth-child(1) {
    grid-column: span 2;
  }
}

/* 🖥 DESKTOP */
@media (min-width: 900px) {
  .card {
    max-width: 600px;
    padding: 30px;
  }
}
</style>