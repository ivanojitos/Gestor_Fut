<template>
  <div class="page">
    <!-- 🔥 HEADER -->
    <div class="header">
      <h1>🏆 Tabla de Competencia</h1>
      <p>Visualiza el rendimiento de equipos y jugadores</p>
    </div>

    <!-- 🔥 LIGAS (NAV TIPO PILLS) -->
    <div class="league-nav">
      <div
        v-for="liga in ligas"
        :key="liga.Id"
        @click="selectLiga(liga)"
        :class="['league-pill', selectedLiga?.Id === liga.Id && 'active']"
      >
        {{ liga.Nombre }}
      </div>
    </div>

    <!-- 🔥 CATEGORÍAS -->
    <div v-if="selectedLiga" class="categories">
      <div
        v-for="cat in categorias"
        :key="cat.Id"
        @click="selectedCategoria = cat"
        :class="['cat-pill', selectedCategoria?.Id === cat.Id && 'active']"
      >
        {{ cat.Nombre }}
      </div>
    </div>

    <!-- 🔥 EMPTY -->
    <div v-if="!currentData" class="empty">⚽ Selecciona una categoría</div>

    <template v-if="currentData">
      <!-- 🔥 PODIO TOP 3 -->
      <div class="podium">
        <div class="place second" v-if="currentData.teams[1]">
          <img :src="currentData.teams[1].logo" />
          <p>{{ currentData.teams[1].name }}</p>
          <span>{{ currentData.teams[1].points }} pts</span>
        </div>

        <div class="place first">
          <img :src="currentData.teams[0].logo" />
          <p>{{ currentData.teams[0].name }}</p>
          <span>{{ currentData.teams[0].points }} pts</span>
        </div>

        <div class="place third" v-if="currentData.teams[2]">
          <img :src="currentData.teams[2].logo" />
          <p>{{ currentData.teams[2].name }}</p>
          <span>{{ currentData.teams[2].points }} pts</span>
        </div>
      </div>

      <!-- 🔥 PREMIOS -->
      <div class="awards">
        <!-- MVP -->
        <div class="award glass" v-if="currentData.mvp">
          <h3>⭐ MVP</h3>
          <img :src="currentData.mvp.photo" />
          <p>{{ currentData.mvp.name }}</p>
        </div>

        <!-- GOLEADOR -->
        <div class="award glass" v-if="currentData.scorer">
          <h3>⚽ Goleador</h3>
          <img :src="currentData.scorer.photo" />
          <p>{{ currentData.scorer.name }}</p>
          <span>{{ currentData.scorer.goals }} goles</span>
        </div>

        <!-- PORTERO -->
        <div class="award glass" v-if="currentData.keeper">
          <h3>🧤 Portero</h3>
          <img :src="currentData.keeper.photo" />
          <p>{{ currentData.keeper.name }}</p>
        </div>
      </div>

      <!-- 🔥 TABLA MODERNA -->
      <div class="table">
        <div
          class="row"
          v-for="(team, index) in currentData.teams"
          :key="team.id"
          @click="goToEquipo(team)"
        >
          <div class="rank">{{ index + 1 }}</div>

          <div class="team">
            <img :src="team.logo" />
            <span>{{ team.name }}</span>
          </div>

          <div class="stats">
            <span>{{ team.points }} pts</span>
            <small>{{ team.wins }}G - {{ team.losses }}P</small>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const API = 
 "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";
// "http://192.168.11.28:8080";

const selectedLiga = ref(null);
const selectedCategoria = ref(null);
const router = useRouter();
const tabla = ref(null);

const ligas = ref([]);

const categorias = ref([]);

const fetchLigas = async () => {
  try {
    const res = await axios.get(`${API}/api/ligas`);
    ligas.value = res.data.data;
  } catch (err) {
    console.error(err);
  }
};

const goToEquipo = (team) => {
  console.log(team);

  router.push({
    name: "EquipoDetalle",
    params: {
      id: team.id,
    },
  });
};

const fetchCategorias = async () => {
  try {
    const res = await axios.get(`${API}/api/categorias`);

    categorias.value = res.data.data.filter(
      (c) => c.Id_Liga === selectedLiga.value.Id,
    );
  } catch (err) {
    console.error(err);
  }
};

const fetchTabla = async () => {
  try {
    const res = await axios.get(`${API}/api/tabla`, {
      params: {
        Id_Liga: selectedLiga.value.Id,
        Id_Categoria: selectedCategoria.value.Id,
      },
    });

    const data = res.data.data;

    tabla.value = {
      teams: data.teams.map((t) => ({
        id: Number(t.Id), // 🔥 fuerza tipo seguro
        name: t.Nombre,
        logo: encodeURI(API + t.Logo),
        wins: t.PG,
        losses: t.PP,
        points: t.PTS,
      })),

      mvp: data.mvp
        ? {
            name: data.mvp.NombreCompleto,
            photo: encodeURI(API + data.mvp.Foto),
          }
        : null,

      scorer: data.scorer
        ? {
            name: data.scorer.NombreCompleto,
            photo: encodeURI(API + data.scorer.Foto),
            goals: data.scorer.Goles,
          }
        : null,

      keeper: data.keeper
        ? {
            name: data.keeper.NombreCompleto,
            photo: encodeURI(API + data.keeper.Foto),
          }
        : null,
    };
  } catch (err) {
    console.error("ERROR TABLA:", err);
  }
};

const currentData = computed(() => tabla.value);

const selectLiga = (liga) => {
  selectedLiga.value = liga;
};

watch(selectedLiga, async () => {
  selectedCategoria.value = null;
  tabla.value = null;

  if (selectedLiga.value) {
    await fetchCategorias();
  }
});

watch(selectedCategoria, async () => {
  if (selectedCategoria.value) {
    await fetchTabla();
  }
});

onMounted(fetchLigas);
</script>

<style scoped>
.page {
  padding: 25px;
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  min-height: 100vh;
  font-family: "Inter", sans-serif;
  color: #0f172a;
}

/* HEADER */
.header {
  margin-bottom: 15px;
}
.header h1 {
  font-size: 26px;
  font-weight: 900;
}
.header p {
  color: #64748b;
}

/* LIGAS */
.league-nav {
  display: flex;
  gap: 10px;
  overflow-x: auto;
}

.league-pill {
  padding: 8px 16px;
  border-radius: 999px;
  background: white;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

.league-pill:hover {
  background: #f1f5f9;
}

.league-pill.active {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
}

/* CATEGORÍAS */
.categories {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.cat-pill {
  padding: 6px 14px;
  border-radius: 999px;
  background: #e2e8f0;
  cursor: pointer;
  font-size: 13px;
}

.cat-pill.active {
  background: #0f172a;
  color: white;
}

/* PODIO PRO */
.podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 20px;
  margin: 40px 0;
}

.place {
  background: white;
  border-radius: 16px;
  padding: 15px;
  width: 110px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  transition: 0.3s;
}

.place img {
  width: 55px;
  border-radius: 50%;
  margin-bottom: 5px;
}

.place.first {
  transform: scale(1.2);
  background: linear-gradient(135deg, #facc15, #f59e0b);
  color: white;
}

.place.second {
  background: linear-gradient(135deg, #e5e7eb, #cbd5f5);
}

.place.third {
  background: linear-gradient(135deg, #fca5a5, #ef4444);
  color: white;
}

/* AWARDS */
.awards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 25px;
}

.award {
  background: white;
  border-radius: 16px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: 0.2s;
}

.award:hover {
  transform: translateY(-5px);
}

.award img {
  width: 60px;
  border-radius: 50%;
  margin: 8px 0;
}

/* TABLA PRO */
.table {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 14px;
  border-radius: 14px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  transition: 0.2s;
}

.row:hover {
  transform: translateX(5px);
}

.rank {
  font-weight: 900;
  font-size: 18px;
  color: #22c55e;
}

.team {
  display: flex;
  align-items: center;
  gap: 10px;
}

.team img {
  width: 35px;
  border-radius: 50%;
}

.stats {
  text-align: right;
}

.stats span {
  font-weight: bold;
}

/* EMPTY */
.empty {
  text-align: center;
  margin-top: 30px;
  color: #94a3b8;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .awards {
    grid-template-columns: 1fr;
  }

  .podium {
    flex-direction: column;
    align-items: center;
  }

  .place {
    width: 80%;
  }
}
</style>
