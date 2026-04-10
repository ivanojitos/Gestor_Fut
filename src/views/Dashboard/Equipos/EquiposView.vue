<template>
  <div class="container">
    <!-- 🔹 FILTROS -->
    <div class="filters-pro">
      <!-- IZQUIERDA: LIGA -->
      <div class="filter-group">
        <p class="filter-title">Liga</p>
        <div class="chips">
          <button
            v-for="liga in ligas"
            :key="liga"
            @click="
              selectedLiga = liga;
              selectedCategoria = '';
            "
            :class="['chip', selectedLiga === liga && 'active']"
          >
            {{ liga }}
          </button>
        </div>
      </div>

      <!-- CENTRO: CATEGORÍA -->
      <div class="filter-group">
        <p class="filter-title">Categoría</p>
        <div class="chips">
          <button
            v-for="cat in categorias"
            :key="cat"
            @click="selectedCategoria = cat"
            :class="['chip secondary', selectedCategoria === cat && 'active']"
          >
            {{ cat }}
          </button>
        </div>
      </div>

      <!-- DERECHA: CAMPEÓN -->
      <div class="champion-side" v-if="currentData?.champion">
        <div class="champion-card">
          <h3>🏆 Campeón</h3>
          <img :src="currentData.champion.logo" />
          <p>{{ currentData.champion.name }}</p>
        </div>
      </div>
    </div>

    <div v-if="!currentData" class="empty-state">
      ⚽ Selecciona una liga y categoría para ver la tabla
    </div>

    <!-- 🔹 PREMIOS -->
    <div class="awards" v-if="currentData">
      <div class="award-card mvp">
        <img :src="currentData.mvp.photo" />
        <h3>⭐ MVP</h3>
        <p>{{ currentData.mvp.name }}</p>
      </div>

      <div class="award-card scorer">
        <img :src="currentData.scorer.photo" />
        <h3>⚽ Goleador</h3>
        <p>{{ currentData.scorer.name }}</p>
        <span>{{ currentData.scorer.goals }} goles</span>
      </div>

      <div class="award-card defense">
        <img :src="currentData.defense.photo" />
        <h3>🛡️ Defensa</h3>
        <p>{{ currentData.defense.name }}</p>
      </div>

      <div class="award-card keeper">
        <img :src="currentData.keeper.photo" />
        <h3>🧤 Portero</h3>
        <p>{{ currentData.keeper.name }}</p>
      </div>
    </div>

    <!-- 🔹 TABLA -->
    <div class="table-container" v-if="currentData">
      <table class="table">
        <thead>
          <tr>
            <th>#</th>
            <th>Equipo</th>
            <th>PJ</th>
            <th>G</th>
            <th>E</th>
            <th>P</th>
            <th>DG</th>
            <th>PTS</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(team, index) in currentData.teams" :key="team.name">
            <td>{{ index + 1 }}</td>
            <td class="team">
              <img :src="team.logo" />
              {{ team.name }}
            </td>
            <td>{{ team.played }}</td>
            <td class="win">{{ team.wins }}</td>
            <td>{{ team.draws }}</td>
            <td class="lose">{{ team.losses }}</td>
            <td>{{ team.goalDiff }}</td>
            <td class="points">{{ team.points }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const selectedLiga = ref(""); // 🔥 valor por defecto
const selectedCategoria = ref("");

// 🔥 opciones dinámicas desde data
const data = {
  "Liga MX": {
    "Sub-20": {
      teams: [
        {
          name: "Águilas FC",
          logo: "https://i.pravatar.cc/40?img=1",
          played: 10,
          wins: 7,
          draws: 2,
          losses: 1,
          goalDiff: 15,
          points: 23,
        },
      ],
      champion: {
        name: "Águilas FC",
        logo: "https://i.pravatar.cc/80?img=30",
      },

      mvp: { name: "Juan Pérez", photo: "https://i.pravatar.cc/80?img=10" },
      scorer: {
        name: "Carlos Ruiz",
        goals: 15,
        photo: "https://i.pravatar.cc/80?img=11",
      },
      defense: {
        name: "Mario López",
        photo: "https://i.pravatar.cc/80?img=12",
      },
      keeper: {
        name: "José Ramírez",
        photo: "https://i.pravatar.cc/80?img=13",
      },
    },

    Primera: {
      teams: [
        {
          name: "Tigres FC",
          logo: "https://i.pravatar.cc/40?img=2",
          played: 10,
          wins: 6,
          draws: 3,
          losses: 1,
          goalDiff: 10,
          points: 21,
        },
        {
          name: "Chivas",
          logo: "https://i.pravatar.cc/40?img=2",
          played: 10,
          wins: 6,
          draws: 3,
          losses: 1,
          goalDiff: 10,
          points: 21,
        },
        {
          name: "Servimsa",
          logo: "https://i.pravatar.cc/40?img=2",
          played: 10,
          wins: 6,
          draws: 3,
          losses: 1,
          goalDiff: 10,
          points: 21,
        },
        {
          name: "Pueba",
          logo: "https://i.pravatar.cc/40?img=2",
          played: 10,
          wins: 6,
          draws: 3,
          losses: 1,
          goalDiff: 10,
          points: 21,
        },
      ],
      mvp: { name: "Luis Díaz", photo: "https://i.pravatar.cc/80?img=14" },
      scorer: {
        name: "Pedro Silva",
        goals: 12,
        photo: "https://i.pravatar.cc/80?img=15",
      },
      defense: { name: "Raúl Gómez", photo: "https://i.pravatar.cc/80?img=16" },
      keeper: { name: "Andrés Cruz", photo: "https://i.pravatar.cc/80?img=17" },
    },
  },
};

// 🔥 dinámicos
const ligas = Object.keys(data);

const categorias = computed(() => {
  return selectedLiga.value ? Object.keys(data[selectedLiga.value]) : [];
});

// 🔥 DATA ACTUAL
const currentData = computed(() => {
  if (!selectedLiga.value || !selectedCategoria.value) return null;
  return data[selectedLiga.value]?.[selectedCategoria.value] || null;
});
</script>

<style scoped>
.layout {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.left {
  flex: 1;
}

.right {
  width: 260px;
  position: sticky;
  top: 20px;
}
.champion-card {
  background: linear-gradient(135deg, #facc15, #fde68a);
  border: 1px solid #facc15;
  padding: 20px;
  border-radius: 18px;
  text-align: center;
  box-shadow: 0 10px 25px rgba(250, 204, 21, 0.25);
}

.champion-card img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  margin: 10px 0;
}

.champion-card h3 {
  margin-bottom: 10px;
}

.champion-card p {
  font-weight: bold;
}
.champion-banner {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 15px;
  border-radius: 16px;
  margin-bottom: 20px;

  background: linear-gradient(135deg, #facc15, #fde68a);
  border: 1px solid #facc15;

  box-shadow: 0 10px 25px rgba(250, 204, 21, 0.3);
}

.champion-banner img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.champion-banner p {
  font-size: 12px;
  font-weight: 600;
  color: #78350f;
}

.champion-banner h3 {
  margin: 0;
  color: #451a03;
}
.empty-state {
  text-align: center;
  margin-top: 30px;
  padding: 20px;
  border-radius: 12px;
  background: #f1f5f9;
  color: #64748b;
  border: 1px dashed #cbd5e1;
  font-size: 14px;
}
/* CONTENEDOR */
/* 🔥 CONTENEDOR PRINCIPAL */
.filters-pro {
  background: #ffffff;
  padding: 18px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.05);
  margin-bottom: 25px;

  display: flex;
  justify-content: space-between; /* 🔥 clave */
  align-items: flex-start;
  gap: 20px;
}

/* cada bloque ocupa espacio similar */
.filter-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

/* campeón a la derecha */
.champion-side {
  flex: 0 0 260px;
  display: flex;
  justify-content: flex-end;
}

/* TITULO */
.filter-title {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
}

/* CHIPS */
.chips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

/* BOTONES */
.chip {
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  color: #1e293b;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: 0.25s;
}

/* HOVER */
.chip:hover {
  background: #e2e8f0;
  transform: scale(1.05);
}

/* ACTIVO */
.chip.active {
  background: linear-gradient(135deg, #22c55e, #4ade80);
  color: white;
  border-color: transparent;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.3);
}

/* SEGUNDO NIVEL */
.chip.secondary.active {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.awards,
.table-container {
  animation: fadeIn 0.4s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* CONTENEDOR PREMIOS */

.awards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

/* CARD */
.award-card {
  background: white;
  border-radius: 16px;
  padding: 15px;
  text-align: center;
  border: 1px solid #e5e7eb;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: 0.3s;
}

.award-card:hover {
  transform: translateY(-5px);
}

/* IMAGEN */
.award-card img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 10px;
}

/* TITULO */
.award-card h3 {
  font-size: 14px;
  margin-bottom: 5px;
  color: #1e293b;
}

/* NOMBRE */
.award-card p {
  font-weight: bold;
  color: #0f172a;
}

/* EXTRA */
.award-card span {
  font-size: 12px;
  color: #64748b;
}

/* COLORES POR TIPO */
.mvp {
  background: #fef9c3;
  border-color: #facc15;
}

.scorer {
  background: #ecfdf5;
  border-color: #22c55e;
}

.defense {
  background: #eff6ff;
  border-color: #3b82f6;
}

.keeper {
  background: #f5f3ff;
  border-color: #8b5cf6;
}
.container {
  padding: 30px;
  background: #f8fafc;
  min-height: 100vh;
}

/* TITULOS */
.title {
  font-size: 24px;
  font-weight: bold;
  color: #0f172a;
}

.subtitle {
  color: #64748b;
  margin-bottom: 20px;
}

/* TABLA */
.table-container {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

.table {
  width: 100%;
  border-collapse: collapse;
}

/* HEADER */
thead {
  background: #f1f5f9;
}

th {
  padding: 14px;
  font-size: 13px;
  text-align: center;
  color: #475569;
}

/* FILAS */
td {
  padding: 14px;
  text-align: center;
  color: #1e293b;
  font-weight: 500;
}

tbody tr {
  border-bottom: 1px solid #e5e7eb;
  transition: 0.2s;
}

tbody tr:hover {
  background: #f8fafc;
}

/* EQUIPO */
.team {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-start;
  font-weight: 600;
}

.team img {
  width: 28px;
  height: 28px;
  border-radius: 50%;
}

/* COLORES */
.win {
  color: #16a34a;
  font-weight: bold;
}

.lose {
  color: #dc2626;
  font-weight: bold;
}

.points {
  font-weight: bold;
  color: #0f172a;
}

/* POSICION */
.pos {
  font-weight: bold;
}
</style>
