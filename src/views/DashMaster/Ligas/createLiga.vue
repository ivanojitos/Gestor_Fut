<template>
  <div class="container">
    <div class="card">
      <h1>🏆 Crear Liga</h1>
      <p class="subtitle">Registra una nueva liga</p>

      <form @submit.prevent="crearLiga">
        <!-- LOGO UPLOAD -->
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

      <p class="error" v-if="error">{{ error }}</p>
      <p class="success" v-if="success">{{ success }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const liga = ref({
  Nombre: "",
  Logo: "", // 🔥 aquí guardas base64 o URL
  Direccion: "",
  Celular: "",
});

const file = ref(null);

const preview = ref(null);
const defaultLogo = "https://via.placeholder.com/120";

const loading = ref(false);
const error = ref("");
const success = ref("");

// 📸 manejar imagen
const handleFile = (e) => {
  const selected = e.target.files[0];
  if (!selected) return;

  file.value = selected; // 🔥 guardas archivo real

  // preview visual (esto sí se queda)
  preview.value = URL.createObjectURL(selected);
};

// 🚀 crear liga
const crearLiga = async () => {
  error.value = "";
  success.value = "";
  loading.value = true;

if (!liga.value.Nombre || !liga.value.Nombre.trim()) {
  error.value = "El nombre es obligatorio";
  loading.value = false;
  return;
}

  try {
    const formData = new FormData();

    formData.append("Nombre", liga.value.Nombre);
    formData.append("Direccion", liga.value.Direccion);
    formData.append("Celular", liga.value.Celular);

    if (file.value) {
      formData.append("Logo", file.value); // 🔥 AQUÍ ESTÁ LA CLAVE
    }

    const res = await axios.post(
      "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net/api/ligas",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (res.data.ok) {
      success.value = "✅ Liga creada";

      liga.value = {
        Nombre: "",
        Direccion: "",
        Celular: "",
      };

      file.value = null;
      preview.value = null;
    }
  } catch (err) {
    error.value = err.response?.data?.error || "Error al crear liga";
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 🌌 FONDO */
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
  max-width: 500px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  padding: 25px;
  border-radius: 20px;
  color: white;
  text-align: center;
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
  padding: 12px;
  border-radius: 10px;
  border: none;
  outline: none;
}

/* BUTTON */
button {
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

/* 📱 TABLET */
@media (min-width: 600px) {
  .card {
    padding: 30px;
  }

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
  }
}
</style>
