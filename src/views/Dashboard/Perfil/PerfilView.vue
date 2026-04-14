<template>
  <div class="layout">
    <!-- 🔹 CARD FIFA -->
    <div class="card">
      <div class="card-top">
        <div class="rating">60</div>
        <div class="position">{{ player.position.toUpperCase() }}</div>

        <img class="logo" :src="player.teamLogo" />

        <div class="photo-container">
          <img :src="player.photo" class="photo" />
        </div>

        <h2 class="name">{{ player.name }}</h2>
        <p class="team">{{ player.team }}</p>
      </div>

      <div class="stats">
        <div class="stat" v-for="stat in stats" :key="stat.label">
          <div class="label">{{ stat.icon }} {{ stat.label }}</div>
          <div class="bar">
            <div class="fill" :style="{ width: stat.value + '%' }"></div>
          </div>
          <div class="value">{{ stat.value }}</div>
        </div>
      </div>
    </div>

    <!-- 🔹 PANEL DERECHO -->
    <div class="info-panel">
      <!-- INFO -->
      <div class="section">
        <h2>👤 Información</h2>
        <p><strong>Edad:</strong> {{ player.age }}</p>
        <p><strong>Número:</strong> {{ player.number }}</p>
        <p><strong>Posición:</strong> {{ player.position }}</p>
      </div>

      <!-- EQUIPO -->
      <div class="section highlight">
        <h2>🛡️ Equipo actual</h2>
        <button class="team-btn" @click="goToTeam">
          Ver {{ player.team }}
        </button>
      </div>

      <!-- LIGAS -->
      <div class="section">
        <h2>🏟️ Ligas jugadas</h2>
        <div class="tags">
          <span v-for="liga in player.ligas" :key="liga">
            {{ liga }}
          </span>
        </div>
      </div>

      <!-- TORNEOS -->
      <div class="section">
        <h2>🏆 Torneos participados</h2>
        <div class="tags blue">
          <span v-for="torneo in player.torneos" :key="torneo">
            {{ torneo }}
          </span>
        </div>
      </div>

      <!-- RENDIMIENTO -->
      <div class="section">
        <h2>📊 Rendimiento</h2>

        <div class="mini-stats">
          <div class="stat-box goals">
            <span class="icon">⚽</span>
            <div class="info">
              <p class="value">{{ player.goals }}</p>
              <span class="label">Goles</span>
            </div>
          </div>

          <div class="stat-box assists">
            <span class="icon">🎯</span>
            <div class="info">
              <p class="value">{{ player.assists }}</p>
              <span class="label">Asistencias</span>
            </div>
          </div>

          <div class="stat-box trophies">
            <span class="icon">🏆</span>
            <div class="info">
              <p class="value">{{ player.trophies }}</p>
              <span class="label">Trofeos</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from "vue";

const player = reactive({
  name: "Ivan Alvarez",
  team: "Xpert fut 7",
  teamLogo:
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbQb1BGG3k6gGMCN8jtwxkNffbz1mJRuLxfQ&s",
  photo:
    "https://assets.realmadrid.com/is/image/realmadrid/1330603286208?$Mobile$&fit=wrap&wid=312",
  age: 24,
  number: 10,
  position: "Delantero",
  goals: 45,
  assists: 20,
  trophies: 5,
  ligas: ["Liga MX", "MLS"],
  torneos: ["Clausura 2024", "Copa Local"],
});

const stats = [
  { label: "VEL", value: 60, icon: "⚡" },
  { label: "TIR", value: 60, icon: "🎯" },
  { label: "PAS", value: 60, icon: "🧭" },
  { label: "REG", value: 60, icon: "🌀" },
  { label: "DEF", value: 60, icon: "🛡️" },
  { label: "FIS", value: 60, icon: "💪" },
];

import { useRouter } from "vue-router";

const router = useRouter();

const goToTeam = () => {
  router.push(`/dashboard/equipo/${player.team}`);
};
</script>

<!-- estilos -->

<style scoped>
.team-btn {
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  border: none;

  background: linear-gradient(135deg, #22c55e, #4ade80);
  color: #022c22;

  font-weight: bold;
  font-size: 14px;
  cursor: pointer;

  transition: all 0.25s ease;
}

/* 🔥 HOVER PRO */
.team-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
}

/* 🔥 CLICK */
.team-btn:active {
  transform: scale(0.97);
}
html,
body {
  margin: 0;
  padding: 0;
  height: auto;
}
body {
  margin: 0;
  background: #f1f5f9;
  justify-content: center;
}
h1,
h2,
h3,
p {
  margin: 0;
}
/* 🔥 LAYOUT */
.layout {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;

  gap: 30px;

  max-width: 1100px;
  margin: 0 auto; /* centra */

  padding: 0; /* 🔥 quita espacio extra */
}

/* 🔥 PANEL DERECHO */
.info-panel {
  flex: 1 1 350px;
  max-width: 420px;

  display: flex;
  flex-direction: column;
  gap: 12px;
  height: auto; /* 🔥 importante */
}

/* 🔥 SECCIONES */
.section {
  background: #ffffff;
  padding: 15px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  color: #1e293b;
}

.section h2 {
  font-size: 14px;
  margin-bottom: 8px;
  color: #0f172a;
}

.section p {
  color: #334155;
}

/* 🔥 DESTACADO */
.highlight {
  background: #ecfdf5;
  border: 1px solid #22c55e;
}

.big {
  font-size: 18px;
  font-weight: bold;
  color: #16a34a;
}

/* 🔥 TAGS */
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tags span {
  background: #f1f5f9;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
}

.tags.blue span {
  background: #dbeafe;
  color: #1d4ed8;
}

/* 🔥 MINI STATS */
.mini-stats {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap;
}

.stat-box {
  flex: 1 1 90px;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  transition: 0.3s;
}

.stat-box:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.icon {
  font-size: 22px;
}

.value {
  font-size: 18px;
  font-weight: bold;
  color: #0f172a;
}

.label {
  font-size: 12px;
  color: #000000;
}

/* 🔥 COLORES */
.goals {
  background: #ecfdf5;
  border-color: #22c55e;
}

.assists {
  background: #eff6ff;
  border-color: #3b82f6;
}

.trophies {
  background: #fffbeb;
  border-color: #f59e0b;
}

/* 🔥 CARD */
.card {
  flex: 1 1 280px;
  max-width: 320px;

  display: flex;
  flex-direction: column;

  border-radius: 25px;
  overflow: hidden;

  background: linear-gradient(135deg, #085325, #5cc96e);

  height: auto; /* 🔥 evita estiramiento */
}

/* 🔥 TOP CARD */
.card-top {
  padding: 15px;
  text-align: center;
  position: relative;
  color: #d38d68;
}

.rating {
  font-size: 45px;
  font-weight: bold;
}

.position {
  font-size: 14px;
  margin-bottom: 5px;
}

.logo {
  width: 40px;
  position: absolute;
  top: 15px;
  right: 15px;
}

/* 🔥 FOTO */
.photo-container {
  background: #6b705c;
  border-radius: 15px;
  padding: 8px;
  margin: 10px auto;
  width: 140px;
}

.photo {
  width: 100%;
  max-height: 140px;
  object-fit: cover;
  border-radius: 10px;
}

/* 🔥 NOMBRE */
.name {
  font-size: 16px;
  margin-top: 8px;
}

.team {
  font-size: 13px;
}

/* 🔥 STATS CARD */
.stats {
  background: #51885a;
  padding: 15px;

  display: grid;
  grid-template-columns: repeat(2, 1fr); /* 🔥 compacta */
  gap: 10px;
}

/* 🔥 BARRAS */
.stat {
  font-size: 12px;
  color: white;
}

.bar {
  background: rgba(255, 255, 255, 0.2);
  height: 6px;
  border-radius: 10px;
  margin: 4px 0;
}

.fill {
  background: #fff;
  height: 100%;
  border-radius: 10px;
}

/* 📱 MÓVIL */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
    align-items: center;
  }

  .card,
  .info-panel {
    width: 100%;
    max-width: 400px;
  }

  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* 📲 TABLET */
@media (max-width: 1024px) {
  .layout {
    gap: 20px;
  }
}
</style>
