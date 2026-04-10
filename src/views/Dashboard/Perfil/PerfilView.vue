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
        <p class="big">{{ player.team }}</p>
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
  photo: "https://assets.realmadrid.com/is/image/realmadrid/1330603286208?$Mobile$&fit=wrap&wid=312",
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
</script>

<style scoped>
.layout {
  display: flex;
  justify-content: center;
  align-items: stretch;
  gap: 50px;
  padding: 10px;
  max-width: 1100px;
  height: 592px; /* 🔥 clave: altura base */
}

/* PANEL */
.info-panel {
  flex: 1; /* 🔥 ocupa el espacio restante */
  max-width: 420px;

  display: flex;
  flex-direction: column;
  gap: 12px;

  height: 100%; /* 🔥 misma altura que card */
}

/* SECCIONES */
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

.section h2 {
  font-size: 14px;
  margin-bottom: 8px;
  color: #1e293b;
}


/* DESTACADO */
.highlight {
  background: #ecfdf5;
  border: 1px solid #22c55e;
}

.big {
  font-size: 18px;
  font-weight: bold;
  color: #16a34a;
}

/* TAGS */
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

/* MINI STATS */
.mini-stats {
  display: flex;
  gap: 10px;
  margin-top: 10px;
  flex-wrap: wrap; /* 🔥 clave */
}

/* CARD */
.stat-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 12px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  transition: 0.3s;
  flex: 1 1 90px; /* 🔥 se acomodan solos */
}

/* HOVER */
.stat-box:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

/* ICONO */
.icon {
  font-size: 22px;
}

/* TEXTO */
.value {
  font-size: 18px;
  font-weight: bold;
  color: #0f172a;
}

.label {
  font-size: 12px;
  color: #000000;
}

/* COLORES POR TIPO */
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

/* CARD (tuya mejorada poquito) */
.card {
  width: 300px;
  flex-shrink: 0; /* 🔥 evita que se encoja */
  border-radius: 25px;
  overflow: hidden;
  background: linear-gradient(135deg, #085325, #5cc96e);
}

.card-top {
  padding: 20px;
  text-align: center;
  position: relative;
  color: #d38d68;
}

.rating {
  font-size: 50px;
  font-weight: bold;
}

.logo {
  width: 50px;
  position: absolute;
  top: 20px;
  right: 20px;
}

.photo-container {
  background: #6b705c;
  border-radius: 20px;
  padding: 10px;
  margin: 10px auto;
  width: 180px;
}

.photo {
  width: 100%;
  border-radius: 15px;
}

.stats {
  background: #51885a;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}
/* 📱 MÓVIL */
@media (max-width: 768px) {
  .layout {
    flex-direction: column;
    align-items: center;
    padding: 20px;
  }

  .card {
    width: 100%;
    max-width: 350px;
  }

  .info-panel {
    width: 100%;
    max-width: 350px;
  }

  .mini-stats {
    flex-direction: column;
  }
}

/* 📲 TABLET */
@media (max-width: 1024px) {
  .layout {
    gap: 20px;
  }

  .card {
    width: 280px;
  }

  .info-panel {
    width: 260px;
  }
}
</style>
