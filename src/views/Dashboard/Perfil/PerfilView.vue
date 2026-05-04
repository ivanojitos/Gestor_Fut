<template>
  <div class="page">
    <div class="wrapper">
      <!-- 🔥 BOTÓN SOLO SI NO TIENE EQUIPO -->
      <button
        v-if="!equipo"
        class="btn-primary"
        @click="showPasswordModal = true"
      >
        ➕ Crear equipo
      </button>

      <!-- 🔥 TARJETA PLAYER -->
      <div class="player-card">
        <div class="card-header">
          <div class="rating">{{ player.rating }}</div>
          <div class="position">{{ player.position }}</div>
        </div>

        <div class="player-main">
          <img :src="player.photo" class="player-img" />
          <div class="player-info">
            <h2>{{ player.name }}</h2>
            <p>{{ equipo?.Nombre || "Sin equipo" }}</p>
          </div>
        </div>

        <div class="stats">
          <div v-for="s in stats" :key="s.label" class="stat">
            <span>{{ s.icon }} {{ s.label }}</span>
            <div class="bar">
              <div class="fill" :style="{ width: s.value + '%' }"></div>
            </div>
            <b>{{ s.value }}</b>
          </div>
        </div>
      </div>

      <!-- 🔥 PANEL DERECHO -->
      <div class="dashboard">
        <!-- PERFIL -->
        <div class="card">
          <h3>👤 Perfil</h3>
          <p><b>Edad:</b> {{ player.age }}</p>
          <p><b>Número:</b> {{ player.number }}</p>
          <p><b>Posición:</b> {{ player.position }}</p>
        </div>

        <!-- EQUIPO -->
        <div class="card highlight">
          <h3>🛡️ Equipo</h3>

          <div v-if="equipo">
            <img v-if="equipo.Logo" :src="equipo.Logo" class="team-logo" />
            <p>
              <b>{{ equipo.Nombre }}</b>
            </p>
          </div>

          <div v-else>
            <p>No tienes equipo</p>
          </div>

          <button @click="goToTeam" class="btn-primary">Ver equipo</button>
        </div>

        <!-- LIGAS -->
        <div class="card">
          <h3>🏟️ Ligas</h3>
          <span v-for="l in player.ligas" :key="l">{{ l }}</span>
        </div>

        <!-- CATEGORIAS -->
        <div class="card">
          <h3>📂 Categorías</h3>
          <span v-for="c in player.categorias" :key="c">{{ c }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- 🔐 PASSWORD -->
  <div v-if="showPasswordModal" class="modal">
    <div class="modal-box">
      <h3>🔐 Acceso</h3>
      <input v-model="password" type="password" />
      <p class="error">{{ passwordError }}</p>

      <button @click="validatePassword">Validar</button>
      <button @click="showPasswordModal = false">Cancelar</button>
    </div>
  </div>

  <!-- 🏆 CREAR EQUIPO -->
  <div v-if="showCreateModal" class="modal">
    <div class="modal-box">
      <h3>Crear Equipo</h3>

      <input v-model="formEquipo.Nombre" placeholder="Nombre" />

      <select v-model="formEquipo.Id_Liga">
        <option disabled value="">Liga</option>
        <option v-for="l in ligas" :key="l.Id" :value="l.Id">
          {{ l.Nombre }}
        </option>
      </select>

      <select v-model="formEquipo.Id_Categoria">
        <option disabled value="">Categoría</option>
        <option v-for="c in categorias" :key="c.Id" :value="c.Id">
          {{ c.Nombre }}
        </option>
      </select>

      <input v-model="formEquipo.Logo" placeholder="Logo URL" />

      <button @click="createEquipo">Crear</button>
      <button @click="closeModal">Cancelar</button>
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
/* 🌌 FONDO GLOBAL */
.page {
  min-height: 100vh;
  padding: 30px;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  font-family: "Segoe UI", sans-serif;
  color: white;
}

/* 🧱 LAYOUT */
.wrapper {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
}

/* 🔘 BOTÓN CREAR */
.btn-primary {
  background: linear-gradient(135deg, #22c55e, #4ade80);
  border: none;
  padding: 12px 18px;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}

.btn-primary:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.5);
}

/* 🧊 PLAYER CARD */
.player-card {
  width: 320px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(25px);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
  transition: 0.3s;
}

.player-card:hover {
  transform: translateY(-5px);
}

/* HEADER PLAYER */
.card-header {
  display: flex;
  justify-content: space-between;
}

.rating {
  font-size: 38px;
  font-weight: bold;
  color: #22c55e;
}

.position {
  font-size: 13px;
  opacity: 0.7;
}

/* INFO PLAYER */
.player-main {
  text-align: center;
}

.player-img {
  width: 130px;
  border-radius: 15px;
  margin: 10px 0;
}

.player-info h2 {
  margin: 5px 0;
}

/* 📊 STATS */
.stats {
  margin-top: 15px;
}

.stat {
  font-size: 12px;
  margin-bottom: 10px;
}

.bar {
  height: 6px;
  background: #1e293b;
  border-radius: 10px;
}

.fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #4ade80);
}

/* 📊 DASHBOARD */
.dashboard {
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 🧊 CARDS */
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(25px);
  border-radius: 15px;
  padding: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: 0.3s;
}

.card:hover {
  transform: translateY(-3px);
}

/* DESTACADO */
.highlight {
  border: 1px solid #22c55e;
}

/* 🏷️ TAGS */
.card span {
  display: inline-block;
  background: #334155;
  padding: 5px 10px;
  border-radius: 20px;
  margin: 4px;
  font-size: 12px;
}

/* 🏆 LOGO EQUIPO */
.team-logo {
  width: 60px;
  margin-bottom: 10px;
  border-radius: 10px;
}

/* 🪟 MODAL */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
}

.modal-box {
  background: #0f172a;
  padding: 25px;
  border-radius: 20px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

/* INPUTS */
.modal-box input,
.modal-box select {
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: #1e293b;
  color: white;
}

/* ERROR */
.error {
  color: #f87171;
  font-size: 12px;
}

/* 📱 RESPONSIVE */
@media (max-width: 768px) {
  .wrapper {
    flex-direction: column;
    align-items: center;
  }

  .player-card {
    width: 100%;
    max-width: 350px;
  }

  .dashboard {
    width: 100%;
  }
}
</style>
