<template>
  <div class="container">
    <!-- 🔹 HEADER -->
    <div class="header">
      <h1>📅 Rol de Juegos</h1>
      <p>Selecciona liga y categoría</p>
    </div>

    <!-- 🔹 SELECTORES -->
    <div class="selectors">
      <div class="tabs">
        <button
          v-for="liga in ligas"
          :key="liga"
          @click="selectedLiga = liga; selectedCategoria = ''"
          :class="['tab', selectedLiga === liga && 'active']"
        >
          {{ liga }}
        </button>
      </div>

      <div class="categories" v-if="categorias.length">
        <button
          v-for="cat in categorias"
          :key="cat"
          @click="selectedCategoria = cat"
          :class="['category', selectedCategoria === cat && 'active']"
        >
          {{ cat }}
        </button>
      </div>
    </div>

    <!-- 🔹 EMPTY -->
    <div v-if="!currentGames" class="empty">
      ⚽ Selecciona liga y categoría
    </div>

    <!-- 🔹 CANCHAS -->
    <div v-if="currentGames" class="fields">
      <div class="field" v-for="field in currentGames" :key="field.name">
        <h2>🏟️ {{ field.name }}</h2>
         <p class="day">{{ field.day }}</p>

        <div class="match" v-for="game in field.games" :key="game.time">
          <div class="time">{{ game.time }}</div>

          <div class="teams">
            <div class="team">
              <img :src="game.home.logo" />
              <span>{{ game.home.name }}</span>
            </div>

            <span class="vs">vs</span>

            <div class="team">
              <img :src="game.away.logo" />
              <span>{{ game.away.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const selectedLiga = ref("");
const selectedCategoria = ref("");

// 🔥 DATA DEMO
const data = {
  "Liga MX": {
    Primera: [
      {
        name: "Cancha 1",
        day: "Sábado 20 Abril", // 🔥 NUEVO
        games: [
          {
            time: "10:00 AM",
            home: { name: "Tigres", logo: "https://i.pravatar.cc/40?img=1" },
            away: { name: "Chivas", logo: "https://i.pravatar.cc/40?img=2" },
          },
        ],
      },
      {
        name: "Cancha 2",
        day: "Domingo 21 Abril", // 🔥 NUEVO
        games: [
          {
            time: "11:00 AM",
            home: { name: "Puebla", logo: "https://i.pravatar.cc/40?img=3" },
            away: { name: "América", logo: "https://i.pravatar.cc/40?img=4" },
          },
        ],
      },
    ],
  },
};

const ligas = Object.keys(data);

const categorias = computed(() => {
  return selectedLiga.value ? Object.keys(data[selectedLiga.value]) : [];
});

const currentGames = computed(() => {
  if (!selectedLiga.value || !selectedCategoria.value) return null;
  return data[selectedLiga.value][selectedCategoria.value];
});
</script>

<style scoped>
/* 🔥 HEADER CANCHA */
.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.field-header h2 {
  font-size: 16px;
  color: #0f172a;
}

/* 🔥 DÍA */
.day {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
}

/* 🔥 MEJORA VISUAL EXTRA */
.field {
  background: white;
  padding: 15px;
  border-radius: 18px;
  border: 1px solid #e5e7eb;
  transition: 0.3s;
}

.field:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px rgba(0,0,0,0.05);
}

/* 🔥 HORA MÁS PRO */
.time {
  font-size: 12px;
  color: #3b82f6;
  font-weight: 600;
}
/* 🔥 CONTENEDOR */
.container {
  padding: 20px;
  background: #f1f5f9;
}

/* 🔹 HEADER */
.header h1 {
  font-size: 22px;
  color: #0f172a;
}

.header p {
  color: #64748b;
  margin-bottom: 20px;
}

/* 🔥 SELECTORES */
.selectors {
  background: white;
  padding: 15px;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  margin-bottom: 20px;
}

/* 🔹 TABS */
.tabs {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.tab {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  background: #f1f5f9;
  cursor: pointer;
  color: #475569;
  transition: 0.3s;
}

.tab.active {
  background: #22c55e;
  color: white;
  font-weight: bold;
}

/* 🔹 CATEGORIAS */
.categories {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.category {
  padding: 8px 14px;
  border-radius: 999px;
  background: #e2e8f0;
  cursor: pointer;
  font-size: 13px;
  color: #0f172a;
}

.category.active {
  background: #3b82f6;
  color: white;
}

/* 🔥 EMPTY */
.empty {
  text-align: center;
  padding: 20px;
  color: #64748b;
}

/* 🔥 CANCHAS */
.fields {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

/* 🔹 CARD CANCHA */
.field {
  background: white;
  padding: 15px;
  border-radius: 18px;
  border: 1px solid #e5e7eb;
}

.field h2 {
  margin-bottom: 10px;
  color: #0f172a;
}

/* 🔥 PARTIDO */
.match {
  background: #f8fafc;
  padding: 10px;
  border-radius: 12px;
  margin-bottom: 10px;
}

/* 🔹 HORA */
.time {
  font-size: 12px;
  color: #64748b;
  margin-bottom: 5px;
}

/* 🔹 EQUIPOS */
.teams {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* 🔹 TEAM */
.team {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #0f172a;
}

.team img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

/* VS */
.vs {
  font-size: 12px;
  color: #64748b;
}

/* 📱 RESPONSIVE */
@media (max-width: 768px) {
  .tabs {
    flex-direction: column;
  }

  .fields {
    grid-template-columns: 1fr;
  }
}
</style>