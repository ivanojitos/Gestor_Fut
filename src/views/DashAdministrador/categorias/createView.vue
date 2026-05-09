<template>
  <div class="page">
    <div class="card">
      <!-- HEADER -->
      <div class="header">
        <div>
          <h2>⚽ Crear Categoría</h2>
          <p>Asigna una categoría a una liga existente</p>
        </div>

        <button class="home-btn" @click="goToHome">🏠 Inicio</button>
      </div>

      <!-- FORM -->
      <form @submit.prevent="submitForm" class="form">
        <div class="input-group">
          <input v-model="form.nombre" required />
          <label>Nombre de la categoría</label>
        </div>

        <div class="select-group">
          <label>Estatus</label>
          <select v-model="form.estatus">
            <option value="activo">Activo</option>
            <option value="inactivo">Inactivo</option>
          </select>
        </div>

        <div class="select-group">
          <label>Seleccionar Liga</label>
          <select v-model="form.id_liga" required>
            <option disabled value="">Selecciona una liga</option>
            <option v-for="liga in ligas" :key="liga.Id" :value="liga.Id">
              {{ liga.Nombre }}
            </option>
          </select>
        </div>

        <button class="btn-save" :disabled="loading">
          <span v-if="!loading">Guardar Categoría</span>
          <span v-else>Guardando...</span>
        </button>

        <p v-if="error" class="error">{{ error }}</p>
      </form>
    </div>
  </div>
  <!-- MODAL -->
  <div v-if="modal.show" class="modal-overlay" @click="modal.show = false">
    <div class="modal" @click.stop>
      <div class="modal-header" :class="modal.type">
        <h3>{{ modal.title }}</h3>
      </div>

      <div class="modal-body">
        <p>{{ modal.message }}</p>
      </div>

      <div class="modal-footer">
        <button @click="modal.show = false">Aceptar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const API =
  "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";
// "http://192.168.11.28:8080";
// "http://192.168.100.228:8080";
const form = ref({
  nombre: "",
  estatus: "activo",
  id_liga: "",
});

const modal = ref({
  show: false,
  title: "",
  message: "",
  type: "success", // success | error
});

const openModal = (title, message, type = "success") => {
  modal.value = {
    show: true,
    title,
    message,
    type,
  };
};

const ligas = ref([]);
const loading = ref(false);
const error = ref("");

// 🔽 Obtener ligas
const fetchLigas = async () => {
  try {
    const res = await axios.get(`${API}/api/ligas`);

    ligas.value = res.data.data; // ✅ AQUÍ ESTÁ LA CLAVE
  } catch (err) {
    console.error(err);
    openModal("Error", "No se pudo guardar la liga", "error");
  }
};

const goToHome = () => {
  router.push({ name: "DashAdministrador" });
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

    openModal("Éxito", "Categoría creada correctamente", "success");

    form.value = {
      nombre: "",
      estatus: "activo",
      id_liga: "",
    };
  } catch (err) {
    openModal("Error", "No se pudo guardar la categoría", "error");
  } finally {
    loading.value = false;
  }
};

onMounted(fetchLigas);
</script>

<style scoped>
/* 🌑 overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
  backdrop-filter: blur(6px);
}

/* 💎 modal */
.modal {
  width: 90%;
  max-width: 380px;
  background: white;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.25);
  animation: pop 0.25s ease;
}

/* header */
.modal-header {
  padding: 14px;
  color: white;
  font-weight: 700;
  text-align: center;
}

.modal-header.success {
  background: linear-gradient(135deg, #22c55e, #16a34a);
}

.modal-header.error {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

/* body */
.modal-body {
  padding: 18px;
  text-align: center;
  color: #334155;
  font-size: 14px;
}

/* footer */
.modal-footer {
  padding: 12px;
  display: flex;
  justify-content: center;
}

.modal-footer button {
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  background: #0f172a;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

.modal-footer button:hover {
  transform: scale(1.05);
}

/* animación */
@keyframes pop {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
/* 🌍 FONDO GENERAL */
.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  padding: 20px;
}

/* 💎 CARD PRINCIPAL */
.card {
  width: 100%;
  max-width: 480px;
  background: #ffffff;
  border-radius: 20px;
  padding: 28px;
  box-shadow: 0 20px 60px rgba(15, 23, 42, 0.08);
  border: 1px solid #eef2f7;
  animation: fadeIn 0.5s ease;
}

/* ✨ HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 25px;
  gap: 10px;
}

.header h2 {
  font-size: 22px;
  color: #0f172a;
  margin: 0;
}

.header p {
  font-size: 13px;
  color: #64748b;
  margin-top: 5px;
}

/* 🏠 BOTÓN HOME */
.home-btn {
  background: #f1f5f9;
  border: 1px solid #e2e8f0;
  color: #0f172a;
  padding: 10px 14px;
  border-radius: 999px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.25s;
  white-space: nowrap;
}

.home-btn:hover {
  background: #e2e8f0;
  transform: translateY(-2px);
}

/* 📦 FORM */
.form {
  display: flex;
  flex-direction: column;
  gap: 18px;
}

/* ✍ INPUT FLOAT MODERNO */
.input-group {
  position: relative;
}

.input-group input {
  width: 100%;
  padding: 14px 12px;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  outline: none;
  font-size: 14px;
  transition: 0.3s;
  background: #fff;
}

.input-group input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

.input-group label {
  position: absolute;
  left: 12px;
  top: 14px;
  font-size: 13px;
  color: #94a3b8;
  pointer-events: none;
  transition: 0.2s ease;
}

/* FLOAT LABEL EFFECT */
.input-group input:focus + label,
.input-group input:valid + label {
  top: -8px;
  background: white;
  padding: 0 6px;
  font-size: 11px;
  color: #6366f1;
}

/* 📥 SELECT */
.select-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.select-group label {
  font-size: 13px;
  color: #64748b;
}

.select-group select {
  width: 100%;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
  outline: none;
  font-size: 14px;
  transition: 0.3s;
}

.select-group select:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
}

/* 🚀 BOTÓN GUARDAR */
button {
  margin-top: 10px;
  padding: 14px;
  border: none;
  border-radius: 14px;
  background: linear-gradient(135deg, #6366f1, #3b82f6);
  color: white;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}

button:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(99, 102, 241, 0.25);
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ❌ ERROR */
.error {
  color: #ef4444;
  font-size: 13px;
  margin-top: 5px;
}

/* ✨ ANIMACIÓN ENTRADA */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 📱 RESPONSIVE TABLET */
@media (max-width: 768px) {
  .card {
    padding: 20px;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .home-btn {
    align-self: flex-end;
  }
}

/* 📱 RESPONSIVE CELULAR */
@media (max-width: 480px) {
  .header h2 {
    font-size: 18px;
  }

  .header p {
    font-size: 12px;
  }

  button {
    font-size: 14px;
  }
}
</style>
