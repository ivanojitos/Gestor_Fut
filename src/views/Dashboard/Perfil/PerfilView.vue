<template>
  <div class="page">
    <div class="container">
      <!-- 🔥 HEADER -->
      <div class="header">
        <img
          v-if="player.photo"
          :key="player.photo"
          :src="encodeURI(API + player.photo.trim())"
          class="avatar"
        />

        <div v-else class="avatar placeholder">
          {{ player.name.charAt(0) }}
        </div>
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
        <div class="card resumen">
          <h3>Resumen</h3>

          <div class="resumen-grid">
            <div>
              <b>{{ partidos }}</b>
              <span>Partidos</span>
            </div>
            <div>
              <b>{{ goles }}</b>
              <span>Goles</span>
            </div>
            <div>
              <b>{{ asistencias }}</b>
              <span>Asistencias</span>
            </div>
            <div>
              <b>{{ tarjetas }}</b>
              <span>Tarjetas</span>
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
// "http://192.168.11.28:8080";

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

  console.log("FOTO:", user.Foto);

  player.name = user.NombreCompleto;
  player.age = user.Edad;
  player.number = user.Numero;
  player.position = user.Posicion;
  player.photo = user.Foto ? user.Foto.replace(/\s+/g, "").trim() : "";

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

const actividad = ref([
  {
    id: 1,
    icon: "⚽",
    titulo: "Gol anotado",
    descripcion: "Anotaste 1 gol en el último partido",
  },
  {
    id: 2,
    icon: "👥",
    titulo: "Nuevo equipo",
    descripcion: "Te uniste a Los Tigres",
  },
  {
    id: 3,
    icon: "📩",
    titulo: "Solicitud enviada",
    descripcion: "Solicitaste unirte a otro equipo",
  },
]);

const goToJoinTeam = () => {
  router.push({ name: "BuscarEquipo" }); // 👈 ajusta al nombre real de tu ruta
};
</script>

<style scoped>
/* 🌍 BASE */
.page {
  min-height: 100vh;
  background: #ffffff;
  padding: 30px 15px;
  font-family: "Inter", sans-serif;
}

.container {
  max-width: 1150px;
  margin: auto;
}

/* 🔥 HEADER MODERNO */
.header {
  background: #fff;
  border-radius: 25px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
}

/* Glow decorativo */
.header::before {
  content: "";
  position: absolute;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, #22c55e33, transparent);
  top: -50px;
  right: -50px;
}

/* 🧑 AVATAR PRO */
.avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 4px solid #22c55e;
  box-shadow:
    0 0 0 6px rgba(34, 197, 94, 0.15),
    0 10px 25px rgba(0, 0, 0, 0.15);
  transition: 0.3s;
}

.avatar:hover {
  transform: scale(1.05);
}

/* Placeholder */
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #22c55e;
  color: white;
  font-size: 34px;
  font-weight: bold;
}

/* INFO */
.header h1 {
  margin: 0;
  font-size: 22px;
}

.team {
  font-size: 13px;
  color: #64748b;
}

/* ⭐ RATING MODERNO */
.rating-box {
  margin-left: auto;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  font-size: 24px;
  font-weight: bold;
  padding: 12px 18px;
  border-radius: 20px;
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.3);
}

/* ✏️ EDIT */
.edit-btn {
  background: #f1f5f9;
  border: none;
  font-size: 18px;
  padding: 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.edit-btn:hover {
  background: #e2e8f0;
  transform: scale(1.1);
}

/* 🔥 GRID INTELIGENTE */
.grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

/* 🧊 CARDS PREMIUM */
.card {
  background: #fff;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: 0.25s;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);
}

/* 📊 RESUMEN PRO */
.resumen {
  grid-row: span 2;
}

.resumen h3 {
  margin-bottom: 15px;
}

.resumen-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.resumen-grid div {
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
  border-radius: 15px;
  padding: 18px;
  text-align: center;
  transition: 0.2s;
}

.resumen-grid div:hover {
  transform: scale(1.05);
}

.resumen-grid b {
  font-size: 24px;
  display: block;
  color: #22c55e;
}

.resumen-grid span {
  font-size: 12px;
  color: #64748b;
}

/* 👤 PERFIL */
.info {
  display: grid;
  gap: 12px;
}

.info div {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  background: #f8fafc;
  padding: 10px;
  border-radius: 10px;
}

/* 🛡️ EQUIPO */
.team-box {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-top: 10px;
}

.team-box img {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
}

.team-info b {
  font-size: 15px;
}

.sub {
  font-size: 12px;
  color: #64748b;
}

/* 🏷️ TAGS */
.tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tags span {
  background: #f1f5f9;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 12px;
}

/* 📱 RESPONSIVE REAL */
@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .rating-box {
    align-self: flex-end;
  }
}
</style>
