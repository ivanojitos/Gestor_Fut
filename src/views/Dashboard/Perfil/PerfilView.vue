<template>
  <div class="page">
    <div class="wrapper">
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
            <p>{{ player.team }}</p>
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
        <!-- INFO -->
        <div class="card">
          <div class="card-header-edit">
            <h3>👤 Perfil</h3>

            <button @click="goToEdit" class="edit-btn">✏️</button>
          </div>
          <div class="grid">
            <p><b>Edad:</b> {{ player.age }}</p>
            <p><b>Número:</b> {{ player.number }}</p>
            <p><b>Posición:</b> {{ player.position }}</p>
          </div>
        </div>

        <!-- EQUIPO -->
        <div class="card highlight">
          <h3>🛡️ Equipo</h3>
          <button @click="goToTeam" class="btn-primary">Ver equipo</button>
        </div>

        <!-- LIGAS -->
        <div class="card">
          <h3>🏟️ Ligas</h3>
          <div class="tags">
            <span v-for="l in player.ligas" :key="l">{{ l }}</span>
          </div>
        </div>

        <!-- TORNEOS -->
        <div class="card">
          <h3>🏆 Torneos</h3>
          <div class="tags blue">
            <span v-for="t in player.torneos" :key="t">{{ t }}</span>
          </div>
        </div>

        <!-- RENDIMIENTO -->
        <div class="card performance">
          <h3>📊 Rendimiento</h3>

          <div class="perf-grid">
            <div class="perf-box goals">
              <span>⚽</span>
              <b>{{ player.goals }}</b>
              <p>Goles</p>
            </div>

            <div class="perf-box assists">
              <span>🎯</span>
              <b>{{ player.assists }}</b>
              <p>Asistencias</p>
            </div>

            <div class="perf-box trophies">
              <span>🏆</span>
              <b>{{ player.trophies }}</b>
              <p>Trofeos</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const player = reactive({
  name: "Ivan Alvarez",
  team: "Xpert fut 7",
  photo:
    "https://assets.realmadrid.com/is/image/realmadrid/1330603286208?$Mobile$&fit=wrap&wid=312",
  age: 24,
  number: 10,
  position: "Delantero",
  rating: 9,
  goals: 45,
  assists: 20,
  trophies: 5,
  ligas: ["Liga MX", "MLS"],
  torneos: ["Clausura 2024", "Copa Local"],
});

const stats = [
  { label: "VEL", value: 85, icon: "⚡" },
  { label: "TIR", value: 82, icon: "🎯" },
  { label: "PAS", value: 78, icon: "🧭" },
  { label: "REG", value: 90, icon: "🌀" },
  { label: "DEF", value: 60, icon: "🛡️" },
  { label: "FIS", value: 80, icon: "💪" },
];

const goToTeam = () => {
  router.push({ name: "EquipoDetalle", params: { id: player.team } });
};
const playerExists = computed(() => {
  return player.name !== ""; // o valida con backend
});

const goToEdit = () => {
  router.push({
    name: "CreateJugador",
    query: { edit: true },
    state: { player }, // 👈 importante
  });
};
</script>

<style scoped>
.card-header-edit {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 18px;
  transition: transform 0.2s, opacity 0.2s;
  opacity: 0.7;
}

.edit-btn:hover {
  transform: scale(1.2);
  opacity: 1;
}
/* 🔥 FONDO */
.page {
  min-height: 100vh;
  background: linear-gradient(135deg, #ffffff, #1e293b);
  padding: 30px;
}

/* 🔥 WRAPPER */
.wrapper {
  display: flex;
  gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
}

/* 🔥 PLAYER CARD */
.player-card {
  width: 320px;
  background: linear-gradient(135deg, #020617, #ffffff);
  border-radius: 20px;
  padding: 20px;
  color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.card-header {
  display: flex;
  justify-content: space-between;
}

.rating {
  font-size: 40px;
  font-weight: bold;
  color: #22c55e;
}

.position {
  font-size: 14px;
  opacity: 0.7;
}

/* 🔥 PLAYER MAIN */
.player-main {
  text-align: center;
}

.player-img {
  width: 140px;
  border-radius: 15px;
  margin: 10px 0;
}

.player-info h2 {
  margin: 5px 0;
}

/* 🔥 STATS */
.stats {
  margin-top: 15px;
}

.stat {
  font-size: 12px;
  margin-bottom: 10px;
}

.bar {
  height: 6px;
  background: #e70303;
  border-radius: 10px;
}

.fill {
  height: 100%;
  background: #22c55e;
}

/* 🔥 DASHBOARD */
.dashboard {
  max-width: 450px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* 🔥 CARDS */
.card {
  background: linear-gradient(135deg, #020617, #ffffff);
  border-radius: 15px;
  padding: 15px;
  color: white;
  backdrop-filter: blur(10px);
}

.highlight {
  border: 1px solid #22c55e;
}

/* 🔥 GRID */
.grid {
  display: grid;
  gap: 5px;
}

/* 🔥 BOTON */
.btn-primary {
  background: linear-gradient(135deg, #22c55e, #4ade80);
  border: none;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
}

/* 🔥 TAGS */
.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tags span {
  background: #334155;
  padding: 5px 10px;
  border-radius: 20px;
}

.tags.blue span {
  background: #334155;
}

/* 🔥 PERFORMANCE */
.performance {
  background: linear-gradient(135deg, #020617, #ffffff);
}

.perf-grid {
  display: flex;
  gap: 10px;
}

.perf-box {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
}

.goals {
  background: #16a34a;
}
.assists {
  background: #2563eb;
}
.trophies {
  background: #f59e0b;
}

.perf-box span {
  font-size: 20px;
}

.perf-box b {
  font-size: 18px;
}

/* 📱 RESPONSIVE */
@media (max-width: 768px) {
  .wrapper {
    flex-direction: column;
    align-items: center;
  }
}
</style>
