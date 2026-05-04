<template>
  <div class="page">
    <div class="container">
      <h1 class="title">Buscar Equipo</h1>

      <!-- 🔍 FILTROS -->
      <div class="filters">
        <select v-model="selectedLiga">
          <option value="">Todas las ligas</option>
          <option v-for="l in ligas" :key="l.Id" :value="l.Id">
            {{ l.Nombre }}
          </option>
        </select>

        <select v-model="selectedCategoria">
          <option value="">Todas las categorías</option>
          <option v-for="c in categorias" :key="c.Id" :value="c.Id">
            {{ c.Nombre }}
          </option>
        </select>

        <button @click="fetchEquipos" class="btn-search">Buscar</button>
      </div>

      <!-- 🏆 LISTA DE EQUIPOS -->
      <div class="grid">
        <div v-for="eq in equipos" :key="eq.Id" class="card">
          <div class="card-top">
            <img :src="eq.Logo || placeholder" class="logo" />

            <div class="info">
              <h3>{{ eq.Nombre }}</h3>
              <p>{{ eq.Liga }} • {{ eq.Categoria }}</p>
              <span class="players">👥 {{ eq.TotalJugadores }} jugadores</span>
            </div>
          </div>

          <button
            v-if="!tieneEquipo && !solicitudesEnviadas.includes(eq.Id)"
            @click="solicitar(eq.Id)"
            class="btn-join"
            :disabled="loadingSolicitud === eq.Id"
          >
            {{
              loadingSolicitud === eq.Id ? "Enviando..." : "Solicitar unirme"
            }}
          </button>

          <span v-else-if="tieneEquipo" class="sent">
            ⚽ Ya tienes equipo
          </span>

          <span v-else class="sent"> ✅ Solicitud enviada </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const API =
  "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";

const ligas = ref([]);
const categorias = ref([]);
const equipos = ref([]);

const selectedLiga = ref("");
const selectedCategoria = ref("");

const placeholder = "https://via.placeholder.com/80";

const fetchCatalogos = async () => {
  ligas.value = (await axios.get(`${API}/api/ligas`)).data.data;
  categorias.value = (await axios.get(`${API}/api/categorias`)).data.data;
};

const fetchEquipos = async () => {
  try {
    const res = await axios.get(`${API}/api/equipos`, {
      params: {
        Id_Liga: selectedLiga.value,
        Id_Categoria: selectedCategoria.value,
      },
    });

    equipos.value = res.data.data || [];
  } catch (error) {
    console.error(error);
    equipos.value = [];
  }
};

const storedUser = JSON.parse(localStorage.getItem("user")) || null;

const solicitudesEnviadas = ref([]);

const solicitar = async (idEquipo) => {
  if (!storedUser) return alert("Debes iniciar sesión");

  try {
    loadingSolicitud.value = idEquipo;

    await axios.post(`${API}/api/solicitudes`, {
      Id_Equipo: idEquipo,
      Id_Jugador: storedUser.Id,
    });

    solicitudesEnviadas.value.push(idEquipo);

    alert("Solicitud enviada 🚀");
  } catch (err) {
    console.error(err);
  } finally {
    loadingSolicitud.value = null;
  }
};

const tieneEquipo = ref(false);
const loadingSolicitud = ref(null);

const checkEquipo = async () => {
  if (!storedUser) return;

  const res = await axios.get(`${API}/api/equipos/jugador/${storedUser.Id}`);
  tieneEquipo.value = res.data.data.length > 0;
};

onMounted(() => {
  fetchCatalogos();
  fetchEquipos();
  checkEquipo();
});
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  padding: 20px;
  color: white;
}

.container {
  max-width: 1100px;
  margin: auto;
}

.title {
  font-size: 28px;
  margin-bottom: 20px;
}

/* 🔍 FILTROS */
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.filters select {
  padding: 10px;
  border-radius: 10px;
  border: none;
}

.btn-search {
  background: #22c55e;
  border: none;
  padding: 10px 15px;
  border-radius: 10px;
  color: white;
  cursor: pointer;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

/* CARD */
.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 15px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: 0.2s;
}

.card:hover {
  transform: translateY(-3px);
}

.card-top {
  display: flex;
  gap: 10px;
}

.logo {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  object-fit: cover;
}

.info h3 {
  margin: 0;
}

.info p {
  font-size: 12px;
  color: #94a3b8;
}

.players {
  font-size: 12px;
}

/* BOTÓN */
.btn-join {
  margin-top: 10px;
  background: #3b82f6;
  border: none;
  padding: 10px;
  border-radius: 10px;
  color: white;
  cursor: pointer;
}

.btn-join:hover {
  background: #2563eb;
}

.empty {
  text-align: center;
  margin-top: 20px;
  color: #94a3b8;
}

/* 📱 RESPONSIVE */
@media (max-width: 600px) {
  .title {
    font-size: 22px;
  }
}
</style>
