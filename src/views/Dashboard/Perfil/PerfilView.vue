<template>
  <div class="page">
    <div class="fut-card-container">
      <div class="fut-card">
        <div v-if="!equipo" style="margin-top: 20px">
          <button class="btn-main primary" @click="showPasswordModal = true">
            CREAR EQUIPO
          </button>
        </div>
        <div class="bg-glow"></div>
        <div class="card-inner-border"></div>

        <button class="edit-btn" @click="openEdit" title="Editar Perfil">
          <span class="icon">✏️</span>
        </button>

        <div class="card-content">
          <div class="top-section">
            <div class="main-stats">
              <div class="rating-value">{{ player.number || 95 }}</div>
              <div class="pos-badge">{{ player.position || "LW" }}</div>
              <div class="divider-line"></div>
              <div class="club-wrapper">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/5323/5323982.png"
                  alt="club"
                />
              </div>
            </div>

            <div class="player-photo-wrapper">
              <div class="photo-cutout">
                <img
                  v-if="player.photo"
                  :src="encodeURI(API + player.photo.trim())"
                  class="actual-img"
                />
                <div v-else class="img-placeholder">
                  {{ player.name?.charAt(0) || "A" }}
                </div>
              </div>
            </div>
          </div>

          <div class="bottom-section">
            <h1 class="player-name-display">{{ player.name || "ANTHONY" }}</h1>

            <div class="stats-grid">
              <div class="stat-item">
                <span class="stat-label">EDAD : </span>
                <span class="stat-value">{{ player.age || "12" }} años</span>
              </div>
              <div class="stat-separator"></div>
              <div class="stat-item">
                <span class="stat-label">ESTATURA : </span>
                <span class="stat-value">
                  {{
                    player.estatura
                      ? (player.estatura / 100).toFixed(2)
                      : "0.00"
                  }}
                  m
                </span>
              </div>
            </div>

            <div class="team-footer">
              <div class="team-tag">
                {{ equipo?.Nombre || "AGENTE LIBRE" }}
              </div>
              <div class="category-chips">
                <span class="chip-premium">{{ player.ligas || "LIGA" }}</span>
                <span class="chip-premium ghost">{{
                  player.categorias || "CATEGORÍA"
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="card-actions">
          <button v-if="!equipo" class="btn-main primary" @click="goToJoinTeam">
            BUSCAR EQUIPO
          </button>

          <button v-if="equipo" class="btn-main primary" @click="goToTeam">
            VER EQUIPO
          </button>

          <!-- 👇 botón separado -->
          <div v-if="equipo" class="danger-zone">
            <button
              class="btn-main danger small"
              @click="showLeaveModal = true"
            >
              ABANDONAR EQUIPO
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 👇 PANEL FUERA DE LA CARD (CORRECTO) -->
    <div v-if="isOwner && equipo" class="requests-panel">
      <h3>Solicitudes de ingreso</h3>

      <table v-if="solicitudes.length" class="requests-table">
        <thead>
          <tr>
            <th>Jugador</th>
            <th>Posición</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="sol in solicitudes" :key="sol.Id">
            <td>{{ sol.NombreCompleto }}</td>
            <td>{{ sol.Posicion }}</td>

            <td class="actions">
              <button class="btn-accept" @click="aceptar(sol.Id)">
                Aceptar
              </button>

              <button class="btn-reject" @click="rechazar(sol.Id)">
                Rechazar
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <p v-else>No hay solicitudes pendientes</p>
    </div>

    <Transition name="fade">
      <div
        v-if="showEditModal"
        class="modal-overlay"
        @click.self="showEditModal = false"
      >
        <div class="modal-content">
          <div class="modal-header">
            <h3>Editar Perfil Jugador</h3>
            <button class="close-modal" @click="showEditModal = false">
              &times;
            </button>
          </div>

          <div class="modal-body">
            <div class="input-group">
              <label>NOMBRE COMPLETO</label>
              <input v-model="editForm.name" type="text" />
            </div>

            <div class="input-row">
              <div class="input-group">
                <label>EDAD</label>
                <input v-model.number="editForm.age" type="number" />
              </div>
              <div class="input-group">
                <label>NÚMERO</label>
                <input v-model="editForm.number" type="number" />
              </div>
            </div>

            <div class="input-group">
              <label>POSICIÓN</label>
              <select v-model="editForm.position">
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

            <div class="input-group">
              <label>FOTO DEL JUGADOR</label>
              <input type="file" @change="handleFile" class="file-input" />
            </div>
          </div>

          <div class="modal-footer">
            <button @click="showEditModal = false" class="btn-cancel">
              CANCELAR
            </button>
            <button @click="updatePlayer" class="btn-save" :disabled="saving">
              {{ saving ? "GUARDANDO..." : "GUARDAR CAMBIOS" }}
            </button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showPasswordModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Acceso restringido</h3>
          </div>

          <div class="modal-body">
            <input
              v-model="passwordInput"
              type="password"
              placeholder="Ingresa contraseña"
            />
            <p style="color: red">{{ passwordError }}</p>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="showPasswordModal = false">
              Cancelar
            </button>
            <button class="btn-save" @click="verifyPassword">Acceder</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showCreateTeamModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>Crear Equipo</h3>
            <button @click="showCreateTeamModal = false">&times;</button>
          </div>

          <div class="modal-body">
            <div class="input-group">
              <label>Nombre</label>
              <input v-model="teamForm.Nombre" />
            </div>

            <div class="input-group">
              <label>Liga</label>
              <select v-model="teamForm.Id_Liga">
                <option disabled value="">Selecciona una liga</option>
                <option v-for="liga in ligas" :key="liga.Id" :value="liga.Id">
                  {{ liga.Nombre }}
                </option>
              </select>
            </div>

            <div class="input-group">
              <label>Categoría</label>
              <select v-model="teamForm.Id_Categoria">
                <option disabled value="">Selecciona una categoría</option>
                <option v-for="cat in categorias" :key="cat.Id" :value="cat.Id">
                  {{ cat.Nombre }}
                </option>
              </select>
            </div>

            <div class="input-group">
              <label>Logo</label>
              <input type="file" @change="handleLogo" />
            </div>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="showCreateTeamModal = false">
              Cancelar
            </button>
            <button class="btn-save" @click="createTeam">Crear Equipo</button>
          </div>
        </div>
      </div>
    </Transition>

    <Transition name="fade">
      <div v-if="showLeaveModal" class="modal-overlay">
        <div class="modal-content">
          <div class="modal-header">
            <h3>¿Salir del equipo?</h3>
          </div>

          <div class="modal-body">
            <p>Esta acción te quitará del equipo actual.</p>
          </div>

          <div class="modal-footer">
            <button class="btn-cancel" @click="showLeaveModal = false">
              Cancelar
            </button>
            <button class="btn-save" @click="leaveTeam">Confirmar</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const API = 
  "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";
// "http://192.168.11.28:8080";
const router = useRouter();
const storedUser = JSON.parse(localStorage.getItem("user"));
const showLeaveModal = ref(false);
const player = reactive({
  Id: storedUser?.Id || null,
  name: "",
  ligas: [],
  categorias: [],
  rating: 0,
  position: "",
  photo: "",
  age: 0,
  number: 0,
  estatura: 0,
});

const equipo = ref(null);
const solicitudes = ref([]);
const isOwner = ref(false);

const showEditModal = ref(false);
const saving = ref(false);
const photoFile = ref(null);
const ligas = ref([]);
const categorias = ref([]);

const editForm = reactive({
  name: "",
  age: "",
  number: "",
  position: "",
});
const showPasswordModal = ref(false);
const showCreateTeamModal = ref(false);
const passwordInput = ref("");
const passwordError = ref("");

const teamForm = reactive({
  Nombre: "",
  Id_Liga: "",
  Id_Categoria: "",
  Logo: null,
});

const verifyPassword = () => {
  if (passwordInput.value === "12345678") {
    passwordError.value = "";
    showPasswordModal.value = false;
    showCreateTeamModal.value = true;
  } else {
    passwordError.value = "Contraseña incorrecta";
  }
};

const handleLogo = (e) => {
  teamForm.Logo = e.target.files[0];
};

const leaveTeam = async () => {
  try {
    await axios.put(`${API}/api/jugadores/${player.Id}/salir-equipo`);

    showLeaveModal.value = false;

    // limpiar datos en frontend
    equipo.value = null;
    player.ligas = equipo.value.Liga || "";
    player.categorias = equipo.value.Categoria || "";

    fetchData();
  } catch (err) {
    console.error(err);
  }
};

const createTeam = async () => {
  try {
    const formData = new FormData();

    formData.append("Nombre", teamForm.Nombre);
    formData.append("Id_Liga", teamForm.Id_Liga);
    formData.append("Id_Categoria", teamForm.Id_Categoria);
    formData.append("Id_Jugador", player.Id);

    formData.append("Estatus", "Activo");

    formData.append("PJ", 0);
    formData.append("PG", 0);
    formData.append("PE", 0);
    formData.append("PP", 0);
    formData.append("GF", 0);
    formData.append("GC", 0);
    formData.append("Diferencia", 0);
    formData.append("PTS", 0);

    if (teamForm.Logo) {
      formData.append("Logo", teamForm.Logo);
    }

    await axios.post(`${API}/api/equipos`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    showCreateTeamModal.value = false;
    fetchData();
  } catch (err) {
    console.error(err);
  }
};
/* =======================
   FETCH DATA
======================= */
const fetchData = async () => {
  if (!player.Id) return;

  try {
    // jugador
    const res = await axios.get(`${API}/api/jugadores/${player.Id}`);
    const user = res.data.data;

    player.name = user.NombreCompleto;
    player.age = user.Edad;
    player.number = user.Numero;
    player.position = user.Posicion?.trim();
    player.estatura = user.Estatura;
    player.photo = user.Foto?.replace(/\s+/g, "").trim();

    // equipo
    const resEquipo = await axios.get(
      `${API}/api/equipos/jugador/${player.Id}`,
    );

    equipo.value = resEquipo.data?.data?.[0] || null;

    if (equipo.value) {
      player.ligas = equipo.value.Liga || [];
      player.categorias = equipo.value.Categoria || [];
    }

    // 👑 si es dueño del equipo
    if (equipo.value?.Id_Jugador === player.Id) {
      isOwner.value = true;

      const resSol = await axios.get(
        `${API}/api/solicitudes/equipo/${equipo.value.Id}`,
      );

      solicitudes.value = resSol.data.data;
    }
  } catch (err) {
    console.error(err);
  }
};

const fetchLigas = async () => {
  const res = await axios.get(`${API}/api/ligas`);
  ligas.value = res.data.data;
};

const fetchCategorias = async () => {
  const res = await axios.get(`${API}/api/categorias`);
  categorias.value = res.data.data;
};

onMounted(() => {
  fetchData();
  fetchLigas();
  fetchCategorias();
});

/* =======================
   OWNER ACTIONS
======================= */
const aceptar = async (id) => {
  await axios.put(`${API}/api/solicitudes/aceptar/${id}`);
  fetchData();
};

const rechazar = async (id) => {
  await axios.put(`${API}/api/solicitudes/rechazar/${id}`);
  fetchData();
};

/* =======================
   NAVIGATION
======================= */
const goToJoinTeam = () => {
  router.push({ name: "BuscarEquipo" });
};

const goToTeam = () => {
  router.push("/equipoDetalle");
};

/* =======================
   EDIT PLAYER
======================= */
const openEdit = () => {
  console.log(player);

  editForm.name = player.name || "";
  editForm.age = Number(player.age) || 0;
  editForm.number = Number(player.number) || 0;
  editForm.position = player.position?.trim() || "";

  showEditModal.value = true;
};

const handleFile = (e) => {
  photoFile.value = e.target.files[0];
};

const updatePlayer = async () => {
  try {
    saving.value = true;

    const formData = new FormData();
    formData.append("NombreCompleto", editForm.name);
    formData.append("Edad", editForm.age);
    formData.append("Numero", editForm.number);
    formData.append("Posicion", editForm.position);

    if (photoFile.value) {
      formData.append("Foto", photoFile.value);
    }

    const res = await axios.put(`${API}/api/jugadores/${player.Id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    const updated = res.data.data;

    Object.assign(player, {
      name: updated.NombreCompleto,
      age: updated.Edad,
      number: updated.Numero,
      position: updated.Posicion,
      photo: updated.Foto,
    });

    showEditModal.value = false;
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Outfit:wght@400;700;900&display=swap");

/* Ajustes Globales de Responsividad */
* {
  box-sizing: border-box;
}

.page {
  min-height: 50vh;
  padding: 20px;
  background-color: #8b8b8b;
  font-family: "Outfit", sans-serif;

  display: flex;
  justify-content: center;
  align-items: flex-start; /* 👈 importante */
  gap: 40px; /* 👈 ESTE ES EL ESPACIO ENTRE CARD Y TABLA */

  flex-wrap: wrap; /* 👈 para que en móvil baje la tabla */
}

/* 🏆 CARTA */
.fut-card-container {
  perspective: 1000px;
  width: 100%;
  max-width: 380px;
}

.fut-card {
  position: relative;
  height: 580px;
  background: #151921;
  clip-path: polygon(50% 0%, 100% 10%, 100% 80%, 50% 100%, 0% 80%, 0% 10%);
  border: 1px solid rgba(255, 255, 255, 0.15);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.6));
}

.bg-glow {
  position: absolute;
  inset: -50%;
  background: radial-gradient(
    circle at center,
    rgba(52, 152, 219, 0.15) 0%,
    transparent 60%
  );
  pointer-events: none;
}

.edit-btn {
  position: absolute;
  top: 70px;
  right: 35px;
  z-index: 10;
  background: #3498db;
  border: none;
  width: 38px;
  height: 38px;
  border-radius: 10px;

  cursor: pointer;
}

.top-section {
  padding: 80px 30px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating-value {
  font-size: 60px;
  font-weight: 900;
  color: #ffffff;
  line-height: 0.8;
}
.pos-badge {
  font-size: 20px;
  font-weight: 700;
  color: #3498db;
}
.divider-line {
  width: 35px;
  height: 3px;
  background: #ffffff;
  margin: 10px 0;
}
.club-wrapper img {
  width: 38px;
  filter: brightness(2);
}

.player-photo-wrapper {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}
.photo-cutout {
  width: 160px;
  height: 160px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 10px;
  overflow: hidden;
}
.actual-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.img-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 50px;
  font-weight: 900;
  color: #333;
}

.bottom-section {
  text-align: center;
  padding: 0 15px;
}
.player-name-display {
  font-size: clamp(20px, 7vw, 30px); /* Ajuste de texto dinámico */
  font-weight: 900;
  color: #ffffff;
  text-transform: uppercase;
  margin-bottom: 10px;
}

.stats-grid {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 15px;
  margin-bottom: 15px;
  background: rgba(255, 255, 255, 0.03);
  padding: 10px;
  border-radius: 10px;
}
.stat-label {
  font-size: 10px;
  color: #3498db;
  font-weight: 900;
}
.stat-value {
  font-size: 18px;
  font-weight: 900;
  color: #ffffff;
}
.stat-separator {
  width: 1px;
  height: 25px;
  background: rgba(255, 255, 255, 0.1);
}

.team-tag {
  font-weight: 800;
  color: #f1c40f;
  font-size: 16px;
  margin-bottom: 10px;
  text-transform: uppercase;
}
.category-chips {
  display: flex;
  justify-content: center;
  gap: 6px;
  flex-wrap: wrap;
}
.chip-premium {
  padding: 6px 15px;
  border-radius: 5px;
  font-size: 12px;
  font-weight: 900;
  background: #ffffff;
}
.chip-premium.ghost {
  background: transparent;
  border: 1px solid #ffffff;
  color: #ffffff;
}

.card-actions {
  margin-top: 25px; /* 👈 antes estaba pegado */
  padding: 0 40px 60px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
/* BASE BUTTON */
.btn-main {
  width: 100%;
  padding: 13px 14px;
  border-radius: 12px;
  border: none;
  font-weight: 900;
  font-size: 13px;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}
/* Botón pequeño (menos importante visualmente) */
.btn-main.small {
  padding: 5px 8px;
  font-size: 8px;
  width: 100%;
  margin: 0 auto; /* centrado */
  opacity: 0.8;
}

/* Hover más sutil */
.btn-main.small:hover {
  opacity: 1;
}
/* EFECTO BRILLO */
.btn-main::before {
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
.btn-main:hover::before {
  left: 100%;
}
.btn-main.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(52, 152, 219, 0.4);
}

/* VER EQUIPO (PRINCIPAL) */
.btn-main.primary {
  background: linear-gradient(135deg, #3498db, #2d7dd2);
  color: white;
  box-shadow: 0 8px 20px rgba(52, 152, 219, 0.25);
}
/* Botón más discreto (menos protagonista) */
.btn-main.danger {
  background: transparent;
  border: 1px solid #e74c3c;
  color: #e74c3c;
  box-shadow: none;
}
.btn-main.danger:hover {
  background: #e74c3c;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(231, 76, 60, 0.3);
}
/* CLICK FEEL */
.btn-main:active {
  transform: scale(0.97);
}
/* 📱 MODAL RESPONSIVO */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  padding: 15px; /* Evita que el modal toque los bordes del móvil */
}

.modal-content {
  background: #1c222d;
  width: 100%;
  max-width: 420px;
  max-height: 95vh; /* Evita que se salga de la pantalla */
  padding: 25px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-shrink: 0;
}
.modal-header h3 {
  color: #ffffff;
}

.modal-body {
  overflow-y: auto; /* Permite scroll si hay muchos campos en pantallas pequeñas */
  padding-right: 5px;
}

.input-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}
.input-group label {
  color: #3498db;
  font-size: 11px;
  font-weight: 900;
  margin-bottom: 5px;
}
.input-group input,
.input-group select {
  background: #0f1218;
  border: 1px solid #333;
  padding: 12px;
  border-radius: 10px;
  color: white;
  width: 100%;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
}

.modal-footer {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-top: 20px;
  flex-shrink: 0;
}

.btn-save {
  background: #3498db;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 700;
  cursor: pointer;
  padding: 12px;
}
.btn-cancel {
  background: #333;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 12px;
  cursor: pointer;
}

/* ANIMATION */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* MEDIA QUERIES ESPECÍFICAS */
@media (max-width: 480px) {
  .fut-card {
    height: 530px;
  }
  .top-section {
    padding: 60px 20px 10px;
  }
  .rating-value {
    font-size: 45px;
  }
  .photo-cutout {
    width: 130px;
    height: 130px;
  }
  .card-actions {
    padding: 0 30px 50px;
  }
  .modal-content {
    padding: 15px;
  }
}

@media (max-width: 350px) {
  .input-row {
    grid-template-columns: 1fr;
  }
}
.requests-panel {
  margin-top: 20px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  color: white;
}

.request-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding: 8px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.request-actions {
  display: flex;
  gap: 5px;
}

.requests-panel {
  margin-top: 20px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.35);
  border-radius: 12px;
  color: white;
}

.requests-panel h3 {
  margin-bottom: 10px;
  font-size: 14px;
  text-transform: uppercase;
  color: #3498db;
}

.requests-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
}

.requests-table th,
.requests-table td {
  padding: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  text-align: left;
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-accept {
  background: #2ecc71;
  border: none;
  padding: 5px 10px;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.btn-reject {
  background: #e74c3c;
  border: none;
  padding: 5px 10px;
  color: white;
  border-radius: 6px;
  cursor: pointer;
}

.empty-msg {
  font-size: 12px;
  opacity: 0.7;
}
/* Zona separada para acciones peligrosas */
.danger-zone {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
