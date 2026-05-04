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
              <span class="players">
                👥 {{ eq.TotalJugadores }} jugadores
              </span>
            </div>
          </div>

          <!-- BOTÓN DINÁMICO -->
          <button
            v-if="!tieneEquipo && !yaSolicito(eq.Id)"
            @click="solicitar(eq.Id)"
            class="btn-join"
            :disabled="loadingSolicitud === eq.Id"
          >
            {{
              loadingSolicitud === eq.Id ? "Enviando..." : "Solicitar unirme"
            }}
          </button>

          <span v-else-if="!tieneEquipo && yaSolicito(eq.Id)" class="sent">
            ✅ Solicitud enviada
          </span>

          <span v-else class="sent"> ⚽ Ya tienes equipo </span>
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

/* =======================
   ESTADO
======================= */
const ligas = ref([]);
const categorias = ref([]);
const equipos = ref([]);

const selectedLiga = ref("");
const selectedCategoria = ref("");

const placeholder = "https://via.placeholder.com/80";

/* usuario (reactivo seguro) */
const storedUser = ref(JSON.parse(localStorage.getItem("user")));

/* solicitudes reales desde DB */
const solicitudes = ref([]);

const loadingSolicitud = ref(null);
const tieneEquipo = ref(false);

/* =======================
   CATALOGOS
======================= */
const fetchCatalogos = async () => {
  const [ligasRes, catRes] = await Promise.all([
    axios.get(`${API}/api/ligas`),
    axios.get(`${API}/api/categorias`),
  ]);

  ligas.value = ligasRes.data.data || [];
  categorias.value = catRes.data.data || [];
};

/* =======================
   EQUIPOS
======================= */
const fetchEquipos = async () => {
  try {
    const res = await axios.get(`${API}/api/equipos`, {
      params: {
        Id_Liga: selectedLiga.value,
        Id_Categoria: selectedCategoria.value,
      },
    });

    equipos.value = res.data.data || [];
  } catch (err) {
    console.error(err);
    equipos.value = [];
  }
};

/* =======================
   SOLICITUDES REALES
======================= */
const fetchSolicitudes = async () => {
  if (!storedUser.value) return;

  const res = await axios.get(
    `${API}/api/solicitudes/jugador/${storedUser.value.Id}`,
  );

  solicitudes.value = res.data.data || [];
};

/* validar si ya solicitó */
const yaSolicito = (idEquipo) => {
  return solicitudes.value.some(
    (s) =>
      s.Id_Equipo === idEquipo &&
      (s.Estado === "Pendiente" || s.Estado === "Abierta"),
  );
};

/* =======================
   SOLICITAR EQUIPO
======================= */
const solicitar = async (idEquipo) => {
  if (!storedUser.value) return alert("Debes iniciar sesión");

  try {
    loadingSolicitud.value = idEquipo;

    await axios.post(`${API}/api/solicitudes`, {
      Id_Equipo: idEquipo,
      Id_Jugador: storedUser.value.Id,
    });

    await fetchSolicitudes();

    alert("Solicitud enviada 🚀");
  } catch (err) {
    alert(err.response?.data?.error || "Error al enviar solicitud");
  } finally {
    loadingSolicitud.value = null;
  }
};

/* =======================
   CHECK EQUIPO ACTUAL
======================= */
const checkEquipo = async () => {
  if (!storedUser.value) return;

  const res = await axios.get(
    `${API}/api/equipos/jugador/${storedUser.value.Id}`,
  );

  tieneEquipo.value = (res.data.data || []).length > 0;
};

/* =======================
   INIT
======================= */
onMounted(() => {
  fetchCatalogos();
  fetchEquipos();
  checkEquipo();
  fetchSolicitudes();
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
