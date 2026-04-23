<template>
  <div class="page">
    <div class="overlay"></div>

    <div class="card">
      <h2>Crear Usuario ⚽</h2>
      <p class="subtitle">Registra un nuevo jugador</p>

      <form @submit.prevent="guardarUsuario">
        <div class="grid">
          <!-- FOTO -->
          <div class="form-group full">
            <label class="label-img">Foto de perfil</label>

            <div class="image-upload" @click="triggerFile">
              <img v-if="preview" :src="preview" class="preview" />
              <div v-else class="placeholder">
                <span>+</span>
                <p>Subir foto</p>
              </div>
            </div>

            <input
              type="file"
              ref="fileInput"
              @change="handleFile"
              accept="image/*"
              hidden
            />
          </div>

          <!-- NOMBRE -->
          <div class="form-group">
            <input v-model="form.nombre" type="text" required />
            <label>Nombre</label>
          </div>

          <!-- NUMERO -->
          <div class="form-group">
            <input v-model="form.numero" type="number" required />
            <label>Número</label>
          </div>

          <!-- EDAD -->
          <div class="form-group">
            <input v-model="form.edad" type="number" required />
            <label>Edad</label>
          </div>

          <!-- POSICION -->
          <div class="form-group">
            <input v-model="form.posicion" type="text" />
            <label>Posición</label>
          </div>

          <!-- PASSWORD 🔐 -->
          <div class="form-group">
            <input v-model="form.password" type="password" required />
            <label>Contraseña</label>
          </div>

          <!-- CORREO -->
          <div class="form-group full">
            <input v-model="form.correo" type="email" required />
            <label>Correo</label>
          </div>

          <!-- ESTATURA -->
          <div class="form-group">
            <input v-model="form.estatura" type="number" />
            <label>Estatura (cm)</label>
          </div>

          <!-- LIGA -->
          <div class="form-group">
            <select v-model="form.liga">
              <option disabled value="">Liga</option>
              <option v-for="liga in ligas" :key="liga.id" :value="liga.id">
                {{ liga.nombre }}
              </option>
            </select>
          </div>

          <!-- CATEGORIA -->
          <div class="form-group full">
            <select v-model="form.categoria">
              <option disabled value="">Categoría</option>
              <option v-for="cat in categorias" :key="cat.id" :value="cat.id">
                {{ cat.nombre }}
              </option>
            </select>
          </div>
        </div>

        <button class="btn">Guardar Usuario</button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axios from "axios";

const fileInput = ref(null);
const preview = ref(null);

const form = ref({
  nombre: "",
  numero: "",
  edad: "",
  posicion: "",
  correo: "",
  estatura: "",
  liga: "",
  categoria: "",
  password: "", // 🔥 agregado
  logo: null,
});

const ligas = ref([
  { id: 1, nombre: "Liga MX" },
  { id: 2, nombre: "Liga Premier" },
]);

const categorias = ref([
  { id: 1, nombre: "Sub-18" },
  { id: 2, nombre: "Mayor" },
]);

const guardarUsuario = async () => {
  try {
    const data = new FormData();

    Object.keys(form.value).forEach((key) => {
      if (form.value[key] !== null && form.value[key] !== "") {
        data.append(key, form.value[key]);
      }
    });

    const response = await axios.post("https://backgestorfut-api-gdbufbgnecdbcqdm.westeurope-01.azurewebsites.net/api/createJugador", data);

    if (response.data.ok) {
      alert(response.data.message);
    }
  } catch (error) {
    if (error.response?.status === 422) {
      alert("Errores en el formulario");
    } else {
      console.error(error);
      alert("Error del servidor");
    }
  }
};

const triggerFile = () => {
  fileInput.value.click();
};

const handleFile = (e) => {
  const file = e.target.files[0];
  form.value.logo = file;

  if (file) {
    preview.value = URL.createObjectURL(file);
  }
};
</script>

<style scoped>
.label-img {
  margin-bottom: 10px;
  display: block;
}

/* CONTENEDOR */
.image-upload {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 2px dashed rgba(255, 255, 255, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  overflow: hidden;
  transition: 0.3s;
}

.image-upload:hover {
  border-color: #818cf8;
  transform: scale(1.05);
}

/* PLACEHOLDER */
.placeholder {
  text-align: center;
  color: #c7d2fe;
}

.placeholder span {
  font-size: 28px;
  display: block;
}

/* PREVIEW */
.preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
/* 🌌 FONDO */
.page {
  min-height: 100vh;
  background: url("https://images.unsplash.com/photo-1518091043644-c1d4457512c6")
    no-repeat center/cover;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

/* 🎨 OVERLAY */
.overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0f172a, #4f46e5);
  opacity: 0.85;
}

/* 🧊 CARD */
.card {
  position: relative;
  width: 95%;
  max-width: 700px;
  padding: 35px;
  border-radius: 20px;
  backdrop-filter: blur(20px);
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 40px rgba(99, 102, 241, 0.4);
  color: white;
}

/* TITULO */
h2 {
  text-align: center;
  font-size: 26px;
  color: #c7d2fe;
}

.subtitle {
  text-align: center;
  margin-bottom: 25px;
  color: #a5b4fc;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.full {
  grid-column: span 2;
}

/* INPUT GROUP */
.form-group {
  position: relative;
}

/* INPUTS */
input,
select {
  width: 100%;
  padding: 12px;
  border-radius: 10px;
  border: none;
  outline: none;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 14px;
}

/* LABEL FLOAT */
.form-group label {
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 13px;
  color: #c7d2fe;
  pointer-events: none;
  transition: 0.3s;
}

input:focus + label,
input:valid + label {
  top: -8px;
  font-size: 11px;
  color: #818cf8;
}

/* SELECT */
select {
  color: #cbd5f5;
}

/* BOTON */
.btn {
  margin-top: 20px;
  width: 100%;
  padding: 14px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.6);
}

/* 📱 RESPONSIVE */
@media (max-width: 600px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .full {
    grid-column: span 1;
  }

  .card {
    padding: 20px;
  }
}
</style>
