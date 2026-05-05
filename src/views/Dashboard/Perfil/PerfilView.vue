<template>
  <div class="page">
    <div class="container">
      <!-- 🔥 HEADER -->
      <div class="header">
        <img :src="player.photo" class="avatar" />
        <div>
          <h1>{{ player.name }}</h1>
          <p>{{ player.position }} • #{{ player.number }}</p>
          <span class="team">{{ equipo?.Nombre || "Sin equipo" }}</span>
        </div>

        <div class="rating-box">
          <span>{{ player.rating || 75 }}</span>
        </div>
        <button class="edit-btn" @click="openEdit">✏️</button>
      </div>

      <!-- 🔥 MAIN GRID -->
      <div class="grid">
        <!-- 📊 STATS GRANDES -->
        <div class="card stats">
          <h3>Rendimiento</h3>

          <div class="stat" v-for="s in stats" :key="s.label">
            <div class="stat-top">
              <span>{{ s.icon }} {{ s.label }}</span>
              <b>{{ s.value }}</b>
            </div>
            <div class="bar">
              <div class="fill" :style="{ width: s.value + '%' }"></div>
            </div>
          </div>
        </div>

        <!-- 👤 PERFIL -->
        <div class="card perfil">
          <h3>Perfil</h3>
          <div class="info">
            <div>
              <b>Edad</b><span>{{ player.age }}</span>
            </div>
            <div>
              <b>Número</b><span>{{ player.number }}</span>
            </div>
            <div>
              <b>Posición</b><span>{{ player.position }}</span>
            </div>
          </div>
        </div>

        <!-- 🛡️ EQUIPO -->
        <div class="card equipo">
          <div class="equipo-header">
            <h3>Equipo</h3>

            <button
              v-if="equipo"
              class="leave-btn"
              @click="showLeaveModal = true"
            >
              Salir
            </button>
          </div>

          <!-- ✅ SI TIENE EQUIPO -->
          <div v-if="equipo" class="team-box">
            <img v-if="equipo.Logo" :src="API + equipo.Logo" />

            <div class="team-info">
              <b>{{ equipo.Nombre }}</b>
              <span class="sub">{{ player.ligas[0] || "Sin liga" }}</span>
              <span class="sub">{{
                player.categorias[0] || "Sin categoría"
              }}</span>
            </div>
          </div>

          <!-- ✅ SI NO TIENE EQUIPO -->
          <div v-else>
            <!-- 🔥 PENDIENTES (SI EXISTEN) -->
            <div v-if="solicitudesPendientes.length > 0" class="pendiente-list">
              <div
                v-for="s in solicitudesPendientes"
                :key="s.Id"
                class="team-box pendiente"
              >
                <img v-if="s.Logo" :src="API + s.Logo" />

                <div class="team-info">
                  <b>{{ s.NombreEquipo }}</b>
                  <span class="sub">⏳ Pendiente</span>
                </div>
              </div>
            </div>

            <!-- 🔥 SIEMPRE MOSTRAR BOTÓN -->
            <div class="no-team">
              <p v-if="solicitudesPendientes.length === 0">No tienes equipo</p>

              <button class="btn-join" @click="goToJoinTeam">
                Buscar equipo
              </button>
            </div>
          </div>
        </div>

        <!-- 🏟️ INFO EXTRA -->
        <div class="card extra">
          <h3>Competición</h3>

          <div class="tags">
            <span>{{ player.ligas[0] || "Sin liga" }}</span>
            <span>{{ player.categorias[0] || "Sin categoría" }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-if="showEditModal" class="modal">
    <div class="modal-box">
      <h3>Editar perfil</h3>

      <input v-model="editForm.name" placeholder="Nombre" />
      <input v-model="editForm.age" type="number" placeholder="Edad" />
      <input v-model="editForm.number" type="number" placeholder="Número" />

      <select v-model="editForm.position">
        <option value="POR">Portero</option>
        <option value="DEF">Defensa</option>
        <option value="MED">Medio</option>
        <option value="DEL">Delantero</option>
      </select>

      <input type="file" @change="handleFile" accept="image/*" />

      <div class="actions">
        <button @click="updatePlayer" class="btn-primary">
          {{ saving ? "Guardando..." : "Guardar" }}
        </button>
        <button @click="showEditModal = false" class="btn-secondary">
          Cancelar
        </button>
      </div>
    </div>
  </div>

  <div v-if="showLeaveModal" class="modal">
    <div class="modal-box small-modal">
      <h3>Salir del equipo</h3>
      <p>¿Estás seguro de que quieres salir de este equipo?</p>

      <div class="actions">
        <button @click="leaveTeam" class="btn-danger">Sí, salir</button>
        <button @click="showLeaveModal = false" class="btn-secondary">
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const API =
  "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";

const router = useRouter();
const saving = ref(false);

const storedUser = JSON.parse(localStorage.getItem("user"));

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
});

const equipo = ref(null);
const ligas = ref([]);
const categorias = ref([]);

const showPasswordModal = ref(false);
const showCreateModal = ref(false);
const password = ref("");
const passwordError = ref("");

const formEquipo = reactive({
  Nombre: "",
  Id_Liga: "",
  Id_Categoria: "",
  Logo: "",
});

const stats = [
  { label: "VEL", value: 80, icon: "⚡" },
  { label: "TIR", value: 75, icon: "🎯" },
];

const solicitudesPendientes = ref([]);

const fetchSolicitudes = async () => {
  if (!player.Id) return;

  const res = await axios.get(`${API}/api/solicitudes/jugador/${player.Id}`);

  // solo pendientes o abiertas
  solicitudesPendientes.value = (res.data.data || []).filter(
    (s) => s.Estado === "Pendiente" || s.Estado === "Abierta",
  );


};

const fetchData = async () => {
  if (!player.Id) return;

  const res = await axios.get(`${API}/api/jugadores/${player.Id}`);
  const user = res.data.data;

  console.log(user);
  

  player.name = user.NombreCompleto;
  player.age = user.Edad;
  player.number = user.Numero;
  player.position = user.Posicion;
  player.photo = user.Foto || "https://via.placeholder.com/150";

  // 🔥 Traer catálogos
  ligas.value = (await axios.get(`${API}/api/ligas`)).data.data;
  categorias.value = (await axios.get(`${API}/api/categorias`)).data.data;

  // 🔥 Traer equipo
  const resEquipo = await axios.get(`${API}/api/equipos/jugador/${player.Id}`);
  equipo.value = resEquipo.data?.data?.[0] || null;

  // 🔥 ASIGNAR NOMBRES (CLAVE)
  if (equipo.value) {
    const liga = ligas.value.find((l) => l.Id === equipo.value.Id_Liga);
    const categoria = categorias.value.find(
      (c) => c.Id === equipo.value.Id_Categoria,
    );

    player.ligas = liga ? [liga.Nombre] : [];
    player.categorias = categoria ? [categoria.Nombre] : [];
  }
};

const validatePassword = () => {
  if (password.value === "fut123") {
    showPasswordModal.value = false;
    showCreateModal.value = true;
    password.value = "";
  } else {
    passwordError.value = "Incorrecta";
  }
};

const createEquipo = async () => {
  if (equipo.value) return alert("Ya tienes equipo");

  await axios.post(`${API}/api/equipos`, {
    ...formEquipo,
    Id_Jugador: player.Id,
  });

  alert("Equipo creado");
  closeModal();
  fetchData();
};

const closeModal = () => {
  showCreateModal.value = false;
  formEquipo.Nombre = "";
  formEquipo.Id_Liga = "";
  formEquipo.Id_Categoria = "";
  formEquipo.Logo = "";
};

const goToTeam = () => {
  if (!equipo.value) return alert("No tienes equipo");

  router.push({
    name: "EquipoDetalle",
    params: { id: equipo.value.Id },
  });
};

const tieneSolicitudes = () => {
  return solicitudesPendientes.value.length > 0;
};

onMounted(() => {
  fetchData();
  fetchSolicitudes();
});

const showEditModal = ref(false);

const editForm = reactive({
  name: "",
  age: "",
  number: "",
  position: "",
  photo: "",
});

const openEdit = () => {
  editForm.name = player.name;
  editForm.age = player.age;
  editForm.number = player.number;
  editForm.position = player.position;
  editForm.photo = player.photo;

  showEditModal.value = true;
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
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const updated = res.data.data;

    player.name = updated.NombreCompleto;
    player.age = updated.Edad;
    player.number = updated.Numero;
    player.position = updated.Posicion;
    player.photo = updated.Foto;

    showEditModal.value = false;
  } catch (err) {
    console.error(err);
  } finally {
    saving.value = false;
  }
};

const showLeaveModal = ref(false);

const leaveTeam = async () => {
  if (!equipo.value) return;

  try {
    saving.value = true;

    const res = await axios.put(
      `${API}/api/jugadores/${player.Id}/salir-equipo`,
    );

    // 🔥 limpiar estado completo
    equipo.value = null;
    player.ligas = [];
    player.categorias = [];

    // opcional si manejas Id_Equipo
    player.Id_Equipo = null;

    showLeaveModal.value = false;

    // 🔥 feedback
    alert("Saliste del equipo correctamente");
  } catch (error) {
    console.error("ERROR REAL:", error);
    alert("Error al salir del equipo");
  } finally {
    saving.value = false;
  }
};

const photoFile = ref(null);

const handleFile = (event) => {
  photoFile.value = event.target.files[0];
};

const goToJoinTeam = () => {
  router.push({ name: "BuscarEquipo" }); // 👈 ajusta al nombre real de tu ruta
};
</script>

<style scoped>
.pendiente-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.page {
  min-height: 100vh;
  background: #f1f5f9;
  padding: 20px;
  font-family: "Inter", sans-serif;
}

/* CONTENEDOR */
.container {
  max-width: 1100px;
  margin: auto;
}

/* 🔥 HEADER */
.header {
  background: white;
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.avatar {
  width: 80px;
  border-radius: 15px;
}

.header h1 {
  margin: 0;
}

.team {
  font-size: 13px;
  color: #64748b;
}

/* RATING */
.rating-box {
  margin-left: auto;
  background: #22c55e;
  color: white;
  font-size: 28px;
  font-weight: bold;
  padding: 10px 18px;
  border-radius: 15px;
}

/* 🔥 GRID */
.grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  grid-auto-rows: minmax(150px, auto);
  gap: 15px;
}

/* CARDS */
.card {
  background: white;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

/* STATS */
.stats {
  grid-row: span 2;
}

.stat {
  margin-bottom: 10px;
}

.stat-top {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
}

.bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 10px;
  margin-top: 4px;
}

.fill {
  height: 100%;
  background: #22c55e;
  border-radius: 10px;
}

/* PERFIL */
.info {
  display: grid;
  gap: 10px;
}

.info div {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
}

/* EQUIPO */
.equipo {
  grid-column: span 1;
}

.team-box {
  display: flex;
  gap: 10px;
  align-items: center;
}

.team-box img {
  width: 50px;
  border-radius: 10px;
}

/* TAGS */
.tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tags span {
  background: #e2e8f0;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
}

/* BOTÓN */
.btn-primary {
  margin-top: 10px;
  background: #22c55e;
  border: none;
  padding: 10px;
  border-radius: 10px;
  color: white;
  cursor: pointer;
}

.btn-primary:hover {
  background: #16a34a;
}

/* 📱 RESPONSIVE */
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .rating-box {
    align-self: flex-end;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .stats {
    grid-row: span 1;
  }
}
/* BOTÓN EDIT */
.edit-btn {
  margin-left: 10px;
  background: transparent;
  border: none;
  font-size: 18px;
  cursor: pointer;
  opacity: 0.6;
  transition: 0.2s;
}

.edit-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

/* MODAL */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-box {
  background: white;
  padding: 20px;
  border-radius: 15px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modal-box input,
.modal-box select {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

/* BOTONES */
.actions {
  display: flex;
  gap: 10px;
}

.btn-secondary {
  background: #e5e7eb;
  border: none;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
}
.equipo-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* TEAM BOX MÁS LIMPIO */
.team-box {
  display: flex;
  gap: 12px;
  align-items: center;
  margin: 10px 0;
}

.team-box img {
  width: 55px;
  height: 55px;
  border-radius: 12px;
  object-fit: cover;
}

/* INFO */
.team-info {
  display: flex;
  flex-direction: column;
}

.team-info b {
  font-size: 15px;
}

.sub {
  font-size: 12px;
  color: #64748b;
}

/* BOTÓN VER */
.small {
  padding: 8px;
  font-size: 13px;
}

/* BOTÓN SALIR (SUTIL) */
.leave-btn {
  background: transparent;
  border: none;
  font-size: 12px;
  color: #ef4444;
  cursor: pointer;
  opacity: 0.7;
}

.leave-btn:hover {
  opacity: 1;
  text-decoration: underline;
}

/* NO TEAM */
.no-team {
  color: #64748b;
  font-size: 13px;
}
.btn-join {
  margin-top: 10px;
  background: #e2e8f0;
  border: none;
  padding: 8px;
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s;
}

.btn-join:hover {
  background: #cbd5f5;
}
</style>
