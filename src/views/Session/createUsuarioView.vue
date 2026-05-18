<template>
  <div class="page">
    <div class="overlay"></div>
    <!-- LOADING -->
    <div v-if="loading" class="loading-overlay">
      <div class="loader"></div>
      <p>Creando jugador...</p>
    </div>

    <div class="card">
      <h2>Crear Usuario ⚽</h2>
      <p class="subtitle">Registra un nuevo jugador</p>

      <form @submit.prevent="guardarUsuario">
        <div class="grid">
          <!-- FOTO -->
          <!-- CATEGORIA -->
         

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
            <input v-model="form.edad" type="number" required placeholder=" " />
            <label>Edad</label>
          </div>

          <!-- POSICION -->
          <div class="form-group">
            <select v-model="form.posicion">
              <option disabled value="">Selecciona una posición</option>

              <optgroup label="Portería">
                <option value="POR">POR - Portero</option>
              </optgroup>

              <optgroup label="Defensa">
                <option value="DFC">DFC - Defensa Central</option>
                <option value="LI">LI - Lateral Izquierdo</option>
                <option value="LD">LD - Lateral Derecho</option>
                <option value="CAI">CAI - Carrilero Izquierdo</option>
                <option value="CAD">CAD - Carrilero Derecho</option>
                <option value="LIB">LIB - Líbero</option>
              </optgroup>

              <optgroup label="Mediocampo">
                <option value="MCD">MCD - Medio Defensivo</option>
                <option value="MC">MC - Mediocentro</option>
                <option value="MCO">MCO - Medio Ofensivo</option>
                <option value="MI">MI - Volante Izquierdo</option>
                <option value="MD">MD - Volante Derecho</option>
              </optgroup>

              <optgroup label="Delantera">
                <option value="EI">EI - Extremo Izquierdo</option>
                <option value="ED">ED - Extremo Derecho</option>
                <option value="SD">SD - Segundo Delantero</option>
                <option value="MP">MP - Media Punta</option>
                <option value="DC">DC - Delantero Centro</option>
              </optgroup>
            </select>
          </div>

          <!-- PASSWORD -->
          <div class="form-group">
            <input
              v-model="form.password"
              type="password"
              required
              placeholder=" "
              autocomplete="new-password"
            />
            <label>Contraseña</label>
          </div>

          <!-- CORREO -->
          <div class="form-group full">
            <input
              v-model="form.correo"
              type="email"
              required
              pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
            />
            <label>Correo</label>
          </div>

          <!-- ESTATURA -->
          <div class="form-group">
            <input v-model="form.estatura" type="number" />
            <label>Estatura (cm)</label>
          </div>

          <!-- CHECK SIN TORNEO -->
          <div class="form-group full checkbox-group">
            <label class="check-label">
              <input type="checkbox" v-model="sinTorneo" />
              Sin torneo
            </label>
          </div>

          <!-- LIGA -->
          <div class="form-group">
            <select v-model="form.liga" :disabled="sinTorneo">
              <option disabled value="">Liga</option>

              <option v-for="liga in ligas" :key="liga.Id" :value="liga.Id">
                {{ liga.Nombre }}
              </option>
            </select>
          </div>

          <!-- CATEGORIA -->
          <div class="form-group full" v-if="form.liga && !sinTorneo">
            <select v-model="form.categoria" :disabled="sinTorneo">
              <option disabled value="">Categoría</option>

              <option
                v-for="cat in categoriasFiltradas"
                :key="cat.Id"
                :value="cat.Id"
              >
                {{ cat.Nombre }}
              </option>
            </select>
          </div>
        </div>

        <div class="actions">
          <button type="submit" class="btn">Guardar Usuario</button>

          <button type="button" class="btn-cancel" @click="cancelar">
            ← Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const loading = ref(false);
const API =
  "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";
// "http://192.168.11.28:8080";
// "http://192.168.100.228:8080";

// 🔥 DATA DINÁMICA
const ligas = ref([]);
const categorias = ref([]);
const categoriasFiltradas = ref([]);
const router = useRouter();
const sinTorneo = ref(false);

const cancelar = () => {
  router.back();
};

// 🔥 CARGAR DESDE BACKEND
const fetchData = async () => {
  try {
    const resLigas = await axios.get(`${API}/api/ligas`);
    ligas.value = resLigas.data.data;

    const resCategorias = await axios.get(`${API}/api/categorias`);
    categorias.value = resCategorias.data.data;
  } catch (error) {
    console.error("Error cargando datos:", error);
  }
};

const filtrarCategorias = () => {
  if (sinTorneo.value) {
    categoriasFiltradas.value = [];
    return;
  }

  categoriasFiltradas.value = categorias.value.filter(
    (cat) => cat.Id_Liga == form.value.liga,
  );

  form.value.categoria = "";
};

onMounted(fetchData);

watch(
  () => form.value.liga,
  filtrarCategorias,
);

watch(sinTorneo, (valor) => {
  if (valor) {
    form.value.liga = 0;
    form.value.categoria = 0;
  } else {
    form.value.liga = "";
    form.value.categoria = "";
  }
});

// 🔥 FORM
const form = ref({
  nombre: "",
  numero: "",
  edad: "",
  posicion: "",
  correo: "",
  estatura: "",
  liga: "",
  categoria: "",
  password: "",
  Foto: null, // 🔥 IMPORTANTE
});

const fileInput = ref(null);
const preview = ref(null);

// 🔥 GUARDAR
const guardarUsuario = async () => {
  try {
    loading.value = true;

    const data = new FormData();

    data.append("nombre", form.value.nombre);
    data.append("numero", form.value.numero);
    data.append("edad", form.value.edad);
    data.append("posicion", form.value.posicion);
    data.append("correo", form.value.correo);
    data.append("estatura", form.value.estatura);
    data.append("liga", sinTorneo.value ? 0 : form.value.liga);
    data.append("Id_Categoria", sinTorneo.value ? 0 : form.value.categoria);
    // data.append("liga", form.value.liga);
    // data.append("Id_Categoria", form.value.categoria);
    data.append("password", form.value.password);

    if (form.value.Foto) {
      data.append("Foto", form.value.Foto);
    }

    const response = await axios.post(`${API}/api/createJugador`, data);

    if (response.data.ok) {
      alert("Jugador creado correctamente");

      // 🔥 LIMPIAR FORMULARIO
      limpiarFormulario();
    }
  } catch (error) {
    console.error(error);
    alert("Error del servidor");
  } finally {
    loading.value = false;
  }
};

const limpiarFormulario = () => {
  form.value = {
    nombre: "",
    numero: "",
    edad: "",
    posicion: "",
    correo: "",
    estatura: "",
    liga: "",
    categoria: "",
    password: "",
    Foto: null,
  };

  preview.value = null;

  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// 🔥 FOTO
const triggerFile = () => {
  fileInput.value.click();
};

const handleFile = (e) => {
  const file = e.target.files[0];
  form.value.Foto = file;

  if (file) {
    preview.value = URL.createObjectURL(file);
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap");

/* RESET */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

/* 🌌 PAGE */
.page {
  min-height: 100vh;

  background:
    linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.88)),
    url("https://images.unsplash.com/photo-1518091043644-c1d4457512c6")
      no-repeat center/cover;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 25px;

  position: relative;
  overflow: hidden;

  font-family: "Inter", sans-serif;
}

/* 🔥 EFECTOS FONDO */
.page::before {
  content: "";

  position: absolute;

  width: 450px;
  height: 450px;

  background: rgba(99, 102, 241, 0.35);

  filter: blur(120px);

  border-radius: 50%;

  top: -120px;
  left: -120px;
}

.page::after {
  content: "";

  position: absolute;

  width: 350px;
  height: 350px;

  background: rgba(34, 197, 94, 0.25);

  filter: blur(120px);

  border-radius: 50%;

  bottom: -120px;
  right: -120px;
}

/* OVERLAY */
.overlay {
  position: absolute;
  inset: 0;

  backdrop-filter: blur(2px);
}

/* LOADING */
.loading-overlay {
  position: fixed;
  inset: 0;

  background: rgba(15, 23, 42, 0.75);

  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;

  z-index: 9999;

  backdrop-filter: blur(6px);
}

.loading-overlay p {
  margin-top: 18px;

  color: white;

  font-size: 16px;
  font-weight: 700;
}

/* SPINNER */
.loader {
  width: 70px;
  height: 70px;

  border: 6px solid rgba(255, 255, 255, 0.2);
  border-top: 6px solid #22c55e;

  border-radius: 50%;

  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 🧊 CARD */
.card {
  position: relative;
  z-index: 10;

  width: 100%;
  max-width: 820px;

  padding: 38px;

  border-radius: 28px;

  background: rgba(255, 255, 255, 0.08);

  backdrop-filter: blur(24px);

  border: 1px solid rgba(255, 255, 255, 0.12);

  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.08);

  animation: fadeUp 0.5s ease;
}

/* ✨ TITLES */
h2 {
  text-align: center;

  font-size: clamp(26px, 4vw, 34px);
  font-weight: 800;

  color: #fff;

  margin-bottom: 8px;
}

.subtitle {
  text-align: center;

  color: #cbd5e1;

  margin-bottom: 32px;

  font-size: 14px;
}

/* GRID */
.grid {
  display: grid;

  grid-template-columns: 1fr 1fr;

  gap: 20px;
}

.full {
  grid-column: span 2;
}

/* INPUT GROUP */
.form-group {
  position: relative;
}

/* INPUTS Y SELECTS */
input,
select {
  width: 100%;

  padding: 16px 14px;

  border-radius: 14px;

  border: 1px solid rgba(255, 255, 255, 0.12);

  outline: none;

  background: rgba(255, 255, 255, 0.08);

  color: white;

  font-size: 14px;

  transition: all 0.25s ease;

  backdrop-filter: blur(10px);
}

/* SELECT OPTIONS */
select option {
  background: #111827;
  color: white;
}

/* FOCUS */
input:focus,
select:focus {
  border-color: #818cf8;

  background: rgba(255, 255, 255, 0.12);

  box-shadow: 0 0 0 4px rgba(129, 140, 248, 0.15);
}

/* LABELS */
.form-group label {
  position: absolute;

  top: 50%;
  left: 14px;

  transform: translateY(-50%);

  font-size: 13px;

  color: #c7d2fe;

  pointer-events: none;

  transition: all 0.25s ease;

  padding: 0 6px;
}

/* FLOATING LABEL */
input:focus + label,
input:not(:placeholder-shown) + label,
select:focus + label,
select:valid + label {
  top: 0;

  transform: translateY(-50%);

  font-size: 11px;

  color: #818cf8;

  background: #1e1b4b;

  border-radius: 20px;
}

/* PLACEHOLDER */
input::placeholder {
  color: transparent;
}

/* CHECKBOX GROUP */
.checkbox-group {
  display: flex;
  align-items: center;

  margin-top: 5px;
}

/* LABEL CHECK */
.check-label {
  display: flex;
  align-items: center;

  gap: 14px;

  width: fit-content;

  padding: 14px 18px;

  border-radius: 18px;

  background: rgba(255, 255, 255, 0.06);

  border: 1px solid rgba(255, 255, 255, 0.12);

  color: #e2e8f0;

  font-size: 14px;
  font-weight: 600;

  cursor: pointer;

  transition: all 0.3s ease;

  backdrop-filter: blur(10px);

  user-select: none;

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 8px 20px rgba(0, 0, 0, 0.15);
}

/* HOVER CHECK */
.check-label:hover {
  transform: translateY(-2px);

  border-color: rgba(34, 197, 94, 0.4);

  box-shadow:
    0 10px 25px rgba(34, 197, 94, 0.15),
    0 0 15px rgba(34, 197, 94, 0.1);
}

/* INPUT CHECK */
.check-label input[type="checkbox"] {
  appearance: none;

  width: 24px;
  height: 24px;

  border-radius: 8px;

  border: 2px solid rgba(255, 255, 255, 0.3);

  background: rgba(255, 255, 255, 0.08);

  cursor: pointer;

  position: relative;

  transition: all 0.25s ease;
}

/* CHECKED */
.check-label input[type="checkbox"]:checked {
  background: linear-gradient(135deg, #22c55e, #16a34a);

  border-color: #22c55e;

  box-shadow:
    0 0 15px rgba(34, 197, 94, 0.45),
    0 0 25px rgba(34, 197, 94, 0.2);
}

/* ICONO CHECK */
.check-label input[type="checkbox"]:checked::before {
  content: "✓";

  position: absolute;

  top: 50%;
  left: 50%;

  transform: translate(-50%, -50%);

  color: white;

  font-size: 14px;
  font-weight: bold;
}

/* DISABLED */
select:disabled {
  opacity: 0.5;

  cursor: not-allowed;

  background: rgba(255, 255, 255, 0.03);

  border-color: rgba(255, 255, 255, 0.08);
}

/* BUTTONS */
.actions {
  display: flex;

  gap: 14px;

  margin-top: 28px;
}

/* BOTÓN GUARDAR */
.btn {
  flex: 1;

  padding: 16px;

  border: none;

  border-radius: 16px;

  background: linear-gradient(135deg, #22c55e, #16a34a);

  color: white;

  font-size: 15px;
  font-weight: 700;

  cursor: pointer;

  transition: all 0.3s ease;

  box-shadow:
    0 10px 25px rgba(34, 197, 94, 0.35),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);

  position: relative;

  overflow: hidden;
}

/* SHINE */
.btn::before {
  content: "";

  position: absolute;

  top: 0;
  left: -100%;

  width: 100%;
  height: 100%;

  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.25),
    transparent
  );

  transition: 0.5s;
}

.btn:hover::before {
  left: 100%;
}

/* HOVER */
.btn:hover {
  transform: translateY(-3px);

  box-shadow:
    0 15px 30px rgba(34, 197, 94, 0.45),
    0 0 20px rgba(34, 197, 94, 0.25);
}

.btn:active {
  transform: scale(0.98);
}

/* BOTÓN CANCELAR */
.btn-cancel {
  flex: 1;

  padding: 16px;

  border-radius: 16px;

  border: 1px solid rgba(255, 255, 255, 0.12);

  background: rgba(255, 255, 255, 0.06);

  color: #e2e8f0;

  font-size: 15px;
  font-weight: 700;

  cursor: pointer;

  transition: all 0.3s ease;

  backdrop-filter: blur(10px);

  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.05),
    0 8px 20px rgba(0, 0, 0, 0.15);
}

.btn-cancel:hover {
  transform: translateY(-3px);

  background: rgba(239, 68, 68, 0.12);

  border-color: rgba(239, 68, 68, 0.35);

  color: white;

  box-shadow:
    0 15px 30px rgba(239, 68, 68, 0.2),
    0 0 15px rgba(239, 68, 68, 0.15);
}

.btn-cancel:active {
  transform: scale(0.98);
}

/* ANIMACIÓN */
@keyframes fadeUp {
  from {
    opacity: 0;
    transform: translateY(25px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 📱 TABLET */
@media (max-width: 900px) {
  .card {
    padding: 30px;
  }

  .grid {
    gap: 16px;
  }
}

/* 📱 MOBILE */
@media (max-width: 640px) {
  .page {
    padding: 15px;
  }

  .card {
    padding: 22px;

    border-radius: 22px;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .full {
    grid-column: span 1;
  }

  h2 {
    font-size: 24px;
  }

  .subtitle {
    font-size: 13px;
  }

  input,
  select {
    padding: 15px 13px;

    font-size: 13px;
  }

  .btn,
  .btn-cancel {
    padding: 15px;

    font-size: 14px;
  }

  .actions {
    flex-direction: column;
  }
}

/* 📱 SMALL DEVICES */
@media (max-width: 400px) {
  .card {
    padding: 18px;
  }

  .check-label {
    width: 100%;
    justify-content: center;
  }
}
</style>
