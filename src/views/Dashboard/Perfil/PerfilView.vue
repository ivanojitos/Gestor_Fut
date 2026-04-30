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
            <p><b>{{ equipo.Nombre }}</b></p>
          </div>

          <div v-else>
            <p>No tienes equipo</p>
          </div>

          <button @click="goToTeam" class="btn-primary">
            Ver equipo
          </button>
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

const API = "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";

const router = useRouter();

const player = reactive({
  Id: localStorage.getItem("userId"),
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
  const user = (await axios.get(`${API}/api/jugador/${player.Id}`)).data.data;

  player.name = user.Nombre;
  player.ligas = user.ligas || [];
  player.categorias = user.categorias || [];
  player.rating = user.Rating || 80;
  player.position = user.Posicion || "N/A";
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
.page { padding:20px; }
.wrapper { display:flex; gap:20px; flex-wrap:wrap; }
.player-card { width:300px; background:#111; color:white; padding:20px; border-radius:15px; }
.modal { position:fixed; inset:0; background:#0008; display:flex; justify-content:center; align-items:center; }
.modal-box { background:white; padding:20px; border-radius:10px; display:flex; flex-direction:column; gap:10px; }
.btn-primary { background:#22c55e; padding:10px; border:none; border-radius:10px; color:white; }
.team-logo { width:50px; }
</style>