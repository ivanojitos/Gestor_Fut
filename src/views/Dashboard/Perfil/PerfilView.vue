<template>
  <div class="page">
    <div class="container">
      <!-- 🔘 CREAR EQUIPO -->
      <button
        v-if="!equipo"
        class="btn-primary top-btn"
        @click="showPasswordModal = true"
      >
        ➕ Crear equipo
      </button>

      <!-- 🔥 PLAYER CARD -->
      <div class="player-card">
        <div class="card-top">
          <span class="rating">{{ player.rating || 75 }}</span>
          <span class="position">{{ player.position }}</span>
        </div>

        <img :src="player.photo" class="player-img" />

        <h2>{{ player.name }}</h2>
        <p class="team">{{ equipo?.Nombre || "Sin equipo" }}</p>

        <div class="stats">
          <div v-for="s in stats" :key="s.label" class="stat">
            <span>{{ s.icon }} {{ s.label }}</span>
            <div class="bar">
              <div class="fill" :style="{ width: s.value + '%' }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 🔥 DASHBOARD -->
      <div class="dashboard">
        <!-- PERFIL -->
        <div class="card">
          <h3>👤 Perfil</h3>
          <div class="grid">
            <p><b>Edad:</b> {{ player.age }}</p>
            <p><b>Número:</b> {{ player.number }}</p>
            <p><b>Posición:</b> {{ player.position }}</p>
          </div>
        </div>

        <!-- EQUIPO -->
        <div class="card highlight">
          <h3>🛡️ Equipo</h3>

          <div v-if="equipo" class="team-box">
            <img v-if="equipo.Logo" :src="equipo.Logo" />
            <b>{{ equipo.Nombre }}</b>
          </div>

          <p v-else>No tienes equipo</p>

          <button @click="goToTeam" class="btn-primary">Ver equipo</button>
        </div>

        <!-- LIGAS -->
        <div class="card">
          <h3>🏟️ Ligas</h3>
          <div class="tags">
            <span v-for="l in player.ligas" :key="l">{{ l }}</span>
          </div>
        </div>

        <!-- CATEGORIAS -->
        <div class="card">
          <h3>📂 Categorías</h3>
          <div class="tags">
            <span v-for="c in player.categorias" :key="c">{{ c }}</span>
          </div>
        </div>
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

const fetchData = async () => {
  if (!player.Id) return;

  const res = await axios.get(`${API}/api/jugadores/${player.Id}`);
  const user = res.data.data;

  console.log("DATA BACK:", user); // 🔥 DEBUG

  player.name = user.NombreCompleto;
  player.age = user.Edad;
  player.number = user.Numero;
  player.position = user.Posicion;
  player.photo = user.Foto || "https://via.placeholder.com/150";

  ligas.value = (await axios.get(`${API}/api/ligas`)).data.data;
  categorias.value = (await axios.get(`${API}/api/categorias`)).data.data;

  const resEquipo = await axios.get(`${API}/api/equipos/jugador/${player.Id}`);
  equipo.value = resEquipo.data?.data?.[0] || null;
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

onMounted(fetchData);
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f8fafc;
  padding: 30px;
  font-family: "Segoe UI", sans-serif;
}

/* CONTENEDOR */
.container {
  max-width: 1100px;
  margin: auto;
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 25px;
}

/* BOTÓN */
.top-btn {
  grid-column: span 2;
}

.btn-primary {
  background: #22c55e;
  border: none;
  padding: 10px 16px;
  border-radius: 10px;
  color: white;
  cursor: pointer;
  font-weight: 600;
}

.btn-primary:hover {
  background: #16a34a;
}

/* PLAYER CARD */
.player-card {
  background: white;
  border-radius: 20px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.card-top {
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
}

.rating {
  font-size: 28px;
  font-weight: bold;
  color: #22c55e;
}

.position {
  font-size: 13px;
  color: #666;
}

.player-img {
  width: 120px;
  border-radius: 15px;
  margin: 10px 0;
}

.team {
  color: #666;
  font-size: 14px;
}

/* STATS */
.stats {
  margin-top: 15px;
}

.stat {
  font-size: 12px;
  margin-bottom: 10px;
  text-align: left;
}

.bar {
  height: 6px;
  background: #e5e7eb;
  border-radius: 10px;
  margin-top: 3px;
}

.fill {
  height: 100%;
  background: #22c55e;
  border-radius: 10px;
}

/* DASHBOARD */
.dashboard {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* CARDS */
.card {
  background: white;
  border-radius: 15px;
  padding: 15px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

/* GRID PERFIL */
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

/* EQUIPO */
.team-box {
  display: flex;
  align-items: center;
  gap: 10px;
}

.team-box img {
  width: 40px;
  border-radius: 8px;
}

/* TAGS */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tags span {
  background: #e5e7eb;
  padding: 5px 10px;
  border-radius: 20px;
  font-size: 12px;
}

/* DESTACADO */
.highlight {
  border-left: 4px solid #22c55e;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .container {
    grid-template-columns: 1fr;
  }

  .top-btn {
    grid-column: span 1;
  }
}
</style>
