<template>
  <div class="container">
    <div class="card">
      <h1>🏆 Crear Liga</h1>
      <p class="subtitle">Registra una nueva liga</p>

      <form @submit.prevent="crearLiga">
        
        <!-- LOGO UPLOAD -->
        <div class="logo-upload">
          <img
            :src="preview || defaultLogo"
            class="logo-preview"
          />
          <input type="file" @change="handleFile" />
        </div>

        <!-- INPUTS -->
        <div class="form">
          <input v-model="liga.Nombre" placeholder="Nombre" required />
          <input v-model="liga.Categorias" placeholder="Categorías" />
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
  Categorias: "",
  Direccion: "",
  Celular: "",
});

const preview = ref(null);
const defaultLogo = "https://via.placeholder.com/120";

const loading = ref(false);
const error = ref("");
const success = ref("");

// 📸 manejar imagen
const handleFile = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    preview.value = reader.result;
    liga.value.Logo = reader.result; // 🔥 mandas base64 al back
  };

  reader.readAsDataURL(file);
};

// 🚀 crear liga
const crearLiga = async () => {
  error.value = "";
  success.value = "";
  loading.value = true;

  if (!liga.value.Nombre) {
    error.value = "El nombre es obligatorio";
    loading.value = false;
    return;
  }

  try {
    const res = await axios.post(
      "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net/api/ligas",
      liga.value
    );

    if (res.data.ok) {
      success.value = "✅ Liga creada";

      liga.value = {
        Nombre: "",
        Logo: "",
        Categorias: "",
        Direccion: "",
        Celular: "",
      };

      preview.value = null;
    }
  } catch (err) {
    error.value =
      err.response?.data?.error || "Error al crear liga";
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