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
                  :src="API + player.photo"
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
              <!-- NUEVO -->
              <div class="stat-separator"></div>

              <div class="stat-item">
                <span class="stat-label">GOLES :</span>
                <span class="stat-value">
                  {{ player.goles || 0 }}
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

          <button v-if="equipo"  class="btn-main scout-btn" @click="goToPlayers">
            🔎 BUSCAR JUGADORES
          </button>

          <!-- 👇 botón separado -->
          <div v-if="equipo && !isOwner" class="danger-zone">
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

      <p style="color: white" v-else>No hay solicitudes pendientes</p>
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
  // "http://192.168.11.217:8080";
// "http://192.168.11.196:8080";

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
  goles: 0,
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
  // contraseña correcta
  if (passwordInput.value === "12345678") {
    // limpiar error
    passwordError.value = "";

    // cerrar modal contraseña
    showPasswordModal.value = false;

    // abrir modal crear equipo
    showCreateTeamModal.value = true;
  } else {
    // mostrar error
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
    player.goles = user.Goles;

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

const goToPlayers = () => {
  router.push({ name: "Jugadores" });
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

/* =========================================
   RESET
========================================= */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html,
body {
  overflow-x: hidden;
}

/* =========================================
   PAGE
========================================= */
.page {
  min-height: 50vh;

  padding: 20px;

  background-color: #8b8b8b;

  font-family: "Outfit", sans-serif;

  display: flex;
  justify-content: center;
  align-items: flex-start;

  gap: 40px;

  flex-wrap: wrap;

  overflow-x: hidden;
}

/* =========================================
   CARD CONTAINER
========================================= */
.fut-card-container {
  width: 100%;
  max-width: 390px;

  perspective: 1200px;
}

/* =========================================
   CARD
========================================= */
.fut-card {
  position: relative;

  width: 100%;
  min-height: 620px;

  background: linear-gradient(
    145deg,
    rgba(17, 24, 39, 0.98),
    rgba(10, 15, 25, 0.98)
  );

  clip-path: polygon(50% 0%, 100% 8%, 100% 85%, 50% 100%, 0% 85%, 0% 8%);

  overflow: hidden;

  border: 1px solid rgba(255, 255, 255, 0.08);

  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.55),
    0 0 30px rgba(52, 152, 219, 0.1);

  transition: 0.35s ease;
}

.fut-card:hover {
  transform: translateY(-5px);
}

/* =========================================
   GLOW
========================================= */
.bg-glow {
  position: absolute;
  inset: -50%;

  background: radial-gradient(
    circle at center,
    rgba(52, 152, 219, 0.18),
    transparent 60%
  );

  pointer-events: none;
}

/* =========================================
   INNER BORDER
========================================= */
.card-inner-border {
  position: absolute;
  inset: 12px;

  border: 1px solid rgba(255, 255, 255, 0.05);

  clip-path: polygon(50% 0%, 100% 8%, 100% 85%, 50% 100%, 0% 85%, 0% 8%);

  pointer-events: none;
}

/* =========================================
   EDIT BUTTON
========================================= */
.edit-btn {
  position: absolute;

  top: 70px;
  right: 28px;

  width: 44px;
  height: 44px;

  border: none;
  border-radius: 14px;

  background: linear-gradient(135deg, #3498db, #2563eb);

  color: white;

  cursor: pointer;

  z-index: 20;

  transition: 0.25s ease;

  box-shadow: 0 12px 24px rgba(52, 152, 219, 0.35);
}

.edit-btn:hover {
  transform: scale(1.08) rotate(-5deg);
}

/* =========================================
   TOP
========================================= */
.top-section {
  padding: 80px 25px 10px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  gap: 15px;
}

/* =========================================
   STATS
========================================= */
.main-stats {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.rating-value {
  font-size: 64px;
  font-weight: 900;

  color: white;

  line-height: 0.9;
}

.pos-badge {
  font-size: 20px;
  font-weight: 800;

  color: #38bdf8;
}

.divider-line {
  width: 40px;
  height: 3px;

  border-radius: 999px;

  background: white;
}

.club-wrapper img {
  width: 38px;

  filter: brightness(2);
}

/* =========================================
   PHOTO
========================================= */
.player-photo-wrapper {
  flex: 1;

  display: flex;
  justify-content: flex-end;
}

.photo-cutout {
  width: 170px;
  height: 170px;

  border-radius: 24px;

  overflow: hidden;

  background: rgba(255, 255, 255, 0.05);

  border: 1px solid rgba(255, 255, 255, 0.08);

  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.35);
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
  justify-content: center;
  align-items: center;

  font-size: 56px;
  font-weight: 900;

  color: rgba(255, 255, 255, 0.35);
}

/* =========================================
   BOTTOM
========================================= */
.bottom-section {
  padding: 12px 22px 0;

  text-align: center;
}

/* =========================================
   NAME
========================================= */
.player-name-display {
  font-size: clamp(22px, 5vw, 32px);

  font-weight: 900;

  color: white;

  text-transform: uppercase;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  margin-bottom: 18px;
}

/* =========================================
   STATS GRID
========================================= */
.stats-grid {
  display: flex;
  justify-content: center;
  align-items: center;

  gap: 18px;

  padding: 14px;

  background: rgba(255, 255, 255, 0.04);

  border-radius: 18px;

  border: 1px solid rgba(255, 255, 255, 0.05);

  margin-bottom: 18px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 10px;
  font-weight: 800;

  color: #38bdf8;

  letter-spacing: 1px;
}

.stat-value {
  font-size: 18px;
  font-weight: 900;

  color: white;
}

.stat-separator {
  width: 1px;
  height: 28px;

  background: rgba(255, 255, 255, 0.08);
}

/* =========================================
   TEAM
========================================= */
.team-tag {
  font-size: 18px;
  font-weight: 900;

  color: #facc15;

  margin-bottom: 12px;

  text-transform: uppercase;
}

.category-chips {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

  gap: 8px;
}

.chip-premium {
  padding: 8px 14px;

  border-radius: 999px;

  background: white;

  color: #111827;

  font-size: 11px;
  font-weight: 900;
}

.chip-premium.ghost {
  background: transparent;

  border: 1px solid rgba(255, 255, 255, 0.18);

  color: white;
}

/* =========================================
   ACTIONS
========================================= */
.card-actions {
  margin-top: 28px;

  padding: 0 26px 35px;

  display: flex;
  flex-direction: column;

  gap: 14px;
}

/* =========================================
   BUTTONS
========================================= */
.btn-main {
  width: 100%;
  height: 52px;

  border: none;
  border-radius: 16px;

  font-size: 13px;
  font-weight: 900;

  letter-spacing: 1px;

  cursor: pointer;

  position: relative;

  overflow: hidden;

  transition: 0.25s ease;
}

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
    rgba(255, 255, 255, 0.22),
    transparent
  );

  transition: 0.6s;
}

.btn-main:hover::before {
  left: 100%;
}

.btn-main.primary {
  background: linear-gradient(135deg, #3498db, #2563eb);

  color: white;

  box-shadow: 0 14px 28px rgba(52, 152, 219, 0.35);
}

.btn-main.primary:hover {
  transform: translateY(-3px);
}

.btn-main.danger {
  background: transparent;

  border: 1px solid rgba(239, 68, 68, 0.5);

  color: #ff6b6b;
}

.btn-main.danger:hover {
  background: #ef4444;

  color: white;
}

.btn-main.small {
  height: 44px;

  font-size: 11px;
}

/* =========================================
   DANGER ZONE
========================================= */
.danger-zone {
  margin-top: 8px;

  padding-top: 14px;

  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

/* =========================================
   REQUEST PANEL
========================================= */
.requests-panel {
  width: 100%;
  max-width: 760px;

  background: rgba(17, 24, 39, 0.95);

  border-radius: 24px;

  padding: 24px;

  border: 1px solid rgba(255, 255, 255, 0.06);

  overflow-x: auto;
}

.requests-panel h3 {
  color: white;

  font-size: 18px;
  font-weight: 900;

  margin-bottom: 18px;
}

.requests-table {
  width: 100%;

  border-collapse: collapse;

  min-width: 500px;
}

.requests-table th {
  padding: 14px 10px;

  color: #38bdf8;

  text-align: left;

  font-size: 12px;
}

.requests-table td {
  padding: 14px 10px;

  color: white;

  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.actions {
  display: flex;
  gap: 8px;
}

.btn-accept,
.btn-reject {
  border: none;

  padding: 8px 14px;

  border-radius: 10px;

  font-size: 11px;
  font-weight: 800;

  color: white;

  cursor: pointer;
}

.btn-accept {
  background: #22c55e;
}

.btn-reject {
  background: #ef4444;
}

/* =========================================
   MODAL OVERLAY
========================================= */
.modal-overlay {
  position: fixed;
  inset: 0;

  z-index: 9999;

  background: rgba(5, 10, 20, 0.82);

  backdrop-filter: blur(10px);

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 16px;

  overflow-y: auto;
}

/* =========================================
   MODAL
========================================= */
.modal-content {
  position: relative;

  width: 100%;
  max-width: 520px;

  background: linear-gradient(
    145deg,
    rgba(22, 28, 40, 0.98),
    rgba(12, 18, 30, 0.98)
  );

  border-radius: 28px;

  border: 1px solid rgba(255, 255, 255, 0.08);

  box-shadow:
    0 20px 60px rgba(0, 0, 0, 0.55),
    0 0 40px rgba(52, 152, 219, 0.08);

  overflow: hidden;

  animation: modalShow 0.35s ease;

  max-height: 95vh;

  display: flex;
  flex-direction: column;
}

.modal-content::before {
  content: "";

  position: absolute;
  top: -120px;
  right: -120px;

  width: 250px;
  height: 250px;

  border-radius: 50%;

  background: rgba(52, 152, 219, 0.12);

  filter: blur(80px);
}

/* =========================================
   MODAL HEADER
========================================= */
.modal-header {
  position: relative;

  padding: 22px 22px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  border-bottom: 1px solid rgba(255, 255, 255, 0.06);

  flex-shrink: 0;
}

.modal-header h3 {
  color: white;

  font-size: 22px;
  font-weight: 900;
}

.modal-header button {
  width: 38px;
  height: 38px;

  border: none;
  border-radius: 12px;

  background: rgba(255, 255, 255, 0.06);

  color: white;

  cursor: pointer;

  transition: 0.25s;
}

.modal-header button:hover {
  background: #ef4444;

  transform: rotate(90deg);
}

/* =========================================
   MODAL BODY
========================================= */
.modal-body {
  padding: 22px;

  overflow-y: auto;

  display: flex;
  flex-direction: column;

  gap: 18px;

  min-height: 0;
}

/* =========================================
   INPUT GROUP
========================================= */
.input-group {
  width: 100%;

  display: flex;
  flex-direction: column;

  gap: 8px;
}

.input-group label {
  color: #8ecfff;

  font-size: 12px;
  font-weight: 800;

  letter-spacing: 1px;

  text-transform: uppercase;
}

/* =========================================
   INPUTS
========================================= */
.input-group input,
.input-group select {
  width: 100%;
  min-width: 0;

  height: 54px;

  border-radius: 16px;

  border: 1px solid rgba(255, 255, 255, 0.08);

  background: rgba(255, 255, 255, 0.04);

  color: white;

  padding: 0 16px;

  outline: none;

  transition: 0.25s;
}

.input-group select option {
  background: #111827;
  color: white;
}

.input-group input:focus,
.input-group select:focus {
  border-color: #3498db;

  background: rgba(255, 255, 255, 0.07);

  box-shadow: 0 0 0 4px rgba(52, 152, 219, 0.12);
}

/* =========================================
   FILE INPUT
========================================= */
input[type="file"] {
  padding: 12px !important;

  height: auto !important;

  background: rgba(52, 152, 219, 0.06) !important;

  border: 1px dashed rgba(52, 152, 219, 0.35) !important;
}

input[type="file"]::file-selector-button {
  border: none;

  background: linear-gradient(135deg, #3498db, #2563eb);

  color: white;

  padding: 10px 14px;

  border-radius: 10px;

  margin-right: 12px;

  cursor: pointer;

  font-weight: 700;
}

/* =========================================
   MODAL FOOTER
========================================= */
.modal-footer {
  padding: 20px 22px;

  border-top: 1px solid rgba(255, 255, 255, 0.06);

  display: grid;
  grid-template-columns: 1fr 1fr;

  gap: 14px;

  flex-shrink: 0;
}

/* =========================================
   SAVE / CANCEL
========================================= */
.btn-save,
.btn-cancel {
  width: 100%;
  height: 52px;

  border: none;
  border-radius: 16px;

  font-size: 13px;
  font-weight: 900;

  cursor: pointer;

  transition: 0.25s;
}

.btn-save {
  background: linear-gradient(135deg, #3498db, #2563eb);

  color: white;
}

.btn-save:hover {
  transform: translateY(-2px);
}

.btn-cancel {
  background: rgba(255, 255, 255, 0.08);

  color: white;
}

.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.14);
}

/* =========================================
   ANIMATION
========================================= */
@keyframes modalShow {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* =========================================
   TABLET
========================================= */
@media (max-width: 1024px) {
  .page {
    gap: 24px;
  }

  .requests-panel {
    max-width: 100%;
  }
}

/* =========================================
   MOBILE
========================================= */
@media (max-width: 768px) {
  .page {
    flex-direction: column;
    align-items: center;

    padding: 16px;
  }

  .fut-card {
    min-height: auto;
  }

  .top-section {
    padding: 70px 18px 10px;
  }

  .photo-cutout {
    width: 135px;
    height: 135px;
  }

  .rating-value {
    font-size: 48px;
  }

  .modal-content {
    max-width: 100%;

    border-radius: 24px;
  }

  .modal-body {
    padding: 18px;
  }

  .modal-footer {
    padding: 18px;
  }
}

/* =========================================
   SMALL MOBILE
========================================= */
@media (max-width: 480px) {
  .page {
    padding: 12px;
  }

  .fut-card-container {
    max-width: 100%;
  }

  .fut-card {
    width: 100%;
  }

  .top-section {
    padding: 60px 14px 10px;

    gap: 10px;
  }

  .rating-value {
    font-size: 38px;
  }

  .pos-badge {
    font-size: 16px;
  }

  .photo-cutout {
    width: 110px;
    height: 110px;

    border-radius: 18px;
  }

  .player-name-display {
    font-size: 20px;
  }

  .stats-grid {
    flex-direction: column;

    gap: 10px;
  }

  .stat-separator {
    display: none;
  }

  .card-actions {
    padding: 0 16px 24px;
  }

  .modal-overlay {
    padding: 10px;
    align-items: flex-start;
  }

  .modal-content {
    margin-top: 20px;

    max-height: unset;

    border-radius: 22px;
  }

  .modal-header {
    padding: 18px;
  }

  .modal-header h3 {
    font-size: 18px;
  }

  .modal-body {
    padding: 16px;
    gap: 14px;
  }

  .input-group input,
  .input-group select {
    height: 50px;

    font-size: 14px;
  }

  .modal-footer {
    grid-template-columns: 1fr;

    padding: 16px;
  }

  .btn-save,
  .btn-cancel {
    height: 50px;
  }
}

/* =========================================
   EXTRA SMALL
========================================= */
@media (max-width: 360px) {
  .top-section {
    flex-direction: column;
    align-items: center;

    text-align: center;
  }

  .player-photo-wrapper {
    justify-content: center;
  }

  .photo-cutout {
    width: 100px;
    height: 100px;
  }

  .rating-value {
    font-size: 34px;
  }

  .player-name-display {
    font-size: 18px;
  }

  .modal-content {
    border-radius: 18px;
  }
}
</style>
