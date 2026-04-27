<template>
  <div class="container">
    <div class="overlay"></div>

    <div class="card">
      <h1>🏆 Crear Liga</h1>
      <p class="subtitle">Registra una nueva liga deportiva</p>

      <form @submit.prevent="crearLiga">
        <div class="grid">
          <div class="input-group">
            <input v-model="liga.Nombre" required />
            <label>Nombre</label>
          </div>

          <div class="input-group">
            <input v-model="liga.Logo" />
            <label>URL Logo</label>
          </div>

          <div class="input-group">
            <input v-model="liga.Categorias" />
            <label>Categorías</label>
          </div>

          <div class="input-group">
            <input v-model="liga.Direccion" />
            <label>Dirección</label>
          </div>

          <div class="input-group">
            <input v-model="liga.Celular" />
            <label>Celular</label>
          </div>

          <div class="input-group">
            <select v-model="liga.Estatus">
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
            <label class="label-fixed">Estatus</label>
          </div>
        </div>

        <button type="submit">🚀 Crear Liga</button>
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
  Logo: "",
  Categorias: "",
  Direccion: "",
  Celular: "",
  Estatus: "Activo",
});

const error = ref("");
const success = ref("");

const crearLiga = async () => {
  error.value = "";
  success.value = "";

  try {
    const res = await axios.post(
      "https://TU_BACK/api/ligas",
      liga.value
    );

    if (res.data.ok) {
      success.value = "✅ Liga creada correctamente";

      // reset form
      liga.value = {
        Nombre: "",
        Logo: "",
        Categorias: "",
        Direccion: "",
        Celular: "",
        Estatus: "Activo",
      };
    }
  } catch (err) {
    error.value = err.response?.data?.error || "Error al crear liga";
  }
};
</script>

<style scoped>
/* 🌌 FONDO */
.container {
  height: 100vh;
  background: url("https://images.unsplash.com/photo-1518091043644-c1d4457512c6")
    no-repeat center/cover;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.85),
    rgba(59, 130, 246, 0.6)
  );
}

/* 🧊 CARD */
.card {
  position: relative;
  background: rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(18px);
  padding: 35px;
  border-radius: 20px;
  width: 420px;
  max-width: 95%;
  color: white;
  text-align: center;
  box-shadow: 0 0 40px rgba(59, 130, 246, 0.3);
}

/* TITULOS */
h1 {
  color: #60a5fa;
  margin-bottom: 5px;
}

.subtitle {
  font-size: 14px;
  color: #cbd5f5;
  margin-bottom: 25px;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

/* INPUTS */
.input-group {
  position: relative;
}

.input-group input,
.input-group select {
  width: 100%;
  padding: 10px;
  border: none;
  border-bottom: 2px solid #60a5fa;
  background: transparent;
  color: white;
  outline: none;
}

/* LABEL */
.input-group label {
  position: absolute;
  left: 0;
  top: 10px;
  font-size: 13px;
  color: #93c5fd;
  transition: 0.3s;
}

.input-group input:focus + label,
.input-group input:valid + label {
  top: -10px;
  font-size: 11px;
  color: #3b82f6;
}

.label-fixed {
  top: -10px;
  font-size: 11px;
}

/* BOTON */
button {
  margin-top: 20px;
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: none;
  font-weight: bold;
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
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

/* 📱 RESPONSIVE */
@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .card {
    padding: 25px;
  }
}
</style>