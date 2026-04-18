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
        :key="liga"
        @click="selectLiga(liga)"
        :class="['league-pill', selectedLiga === liga && 'active']"
      >
        {{ liga }}
      </div>
    </div>

    <!-- 🔥 CATEGORÍAS -->
    <div v-if="selectedLiga" class="categories">
      <div
        v-for="cat in categorias"
        :key="cat"
        @click="selectedCategoria = cat"
        :class="['cat-pill', selectedCategoria === cat && 'active']"
      >
        {{ cat }}
      </div>
    </div>

    <!-- 🔥 EMPTY -->
    <div v-if="!currentData" class="empty">
      ⚽ Selecciona una categoría
    </div>

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
        <div class="award glass">
          <h3>⭐ MVP</h3>
          <img :src="currentData.mvp.photo" />
          <p>{{ currentData.mvp.name }}</p>
        </div>

        <div class="award glass">
          <h3>⚽ Goleador</h3>
          <img :src="currentData.scorer.photo" />
          <p>{{ currentData.scorer.name }}</p>
          <span>{{ currentData.scorer.goals }} goles</span>
        </div>

        <div class="award glass">
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
          :key="team.name"
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
import { ref, computed } from "vue";

const selectedLiga = ref("");
const selectedCategoria = ref("");

const data = {
  "Liga MX": {
    Primera: {
      teams: [
        { name: "Tigres", logo: "https://i.pravatar.cc/40?img=1", wins: 7, losses: 1, points: 22 },
        { name: "Chivas", logo: "https://i.pravatar.cc/40?img=2", wins: 6, losses: 2, points: 20 },
        { name: "Puebla", logo: "https://i.pravatar.cc/40?img=3", wins: 5, losses: 3, points: 18 },
      ],
      mvp: { name: "Luis Díaz", photo: "https://i.pravatar.cc/80?img=10" },
      scorer: { name: "Pedro", goals: 12, photo: "https://i.pravatar.cc/80?img=11" },
      keeper: { name: "Andrés", photo: "https://i.pravatar.cc/80?img=12" },
    },
  },
};

const ligas = Object.keys(data);

const categorias = computed(() =>
  selectedLiga.value ? Object.keys(data[selectedLiga.value]) : []
);

const currentData = computed(() => {
  if (!selectedLiga.value || !selectedCategoria.value) return null;
  return data[selectedLiga.value][selectedCategoria.value];
});

const selectLiga = (liga) => {
  selectedLiga.value = liga;
  selectedCategoria.value = "";
};
</script>

<style scoped>
.page {
  padding: 25px;
  background: linear-gradient(135deg,#020617,#ffffff);
  min-height: 100vh;
  color: white;
}

/* HEADER */
.header h1 {
  font-size: 24px;
}
.header p {
  color: #94a3b8;
  font-size: 13px;
}

/* LIGAS */
.league-nav {
  display: flex;
  gap: 10px;
  margin: 20px 0;
}

.league-pill {
  padding: 8px 16px;
  border-radius: 999px;
  background: #1e293b;
  cursor: pointer;
}

.league-pill.active {
background: linear-gradient(135deg,#0b37ff,#b5b5be);
  color: rgb(255, 254, 254);
}

/* CATEGORÍAS */
.categories {
  display: flex;
  gap: 10px;
}

.cat-pill {
  padding: 6px 14px;
  border-radius: 999px;
  background: #334155;
  cursor: pointer;
}

.cat-pill.active {
background: linear-gradient(135deg,#0b37ff,#b5b5be);
}

/* PODIO */
.podium {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin: 30px 0;
}

.place {
  text-align: center;
}

.place img {
  width: 60px;
  border-radius: 50%;
}

.first {
  transform: scale(1.2);
}

/* AWARDS */
.awards {
  display: flex;
  gap: 15px;
  margin-bottom: 25px;
}

.glass {
  background: rgba(255,255,255,0.05);
  backdrop-filter: blur(10px);
  padding: 15px;
  border-radius: 16px;
  text-align: center;
  flex: 1;
}

/* TABLA */
.table {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.row {
  display: flex;
  justify-content: space-between;
  background: #1e293b;
  padding: 12px;
  border-radius: 12px;
  align-items: center;
  transition: 0.3s;
}

.row:hover {
  transform: translateX(5px);
  background: #334155;
}

.team {
  display: flex;
  align-items: center;
  gap: 10px;
}

.team img {
  width: 30px;
  border-radius: 50%;
}

.rank {
  font-weight: bold;
  font-size: 18px;
}

.stats {
  text-align: right;
}

.empty {
  text-align: center;
  margin-top: 30px;
  color: #94a3b8;
}
</style>