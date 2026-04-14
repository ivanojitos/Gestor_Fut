<template>
  <div class="container">
    <!-- 🔹 FILTROS -->
    <div class="filters-pro">
      <!-- 🔹 LIGAS -->
      <div class="selector">
        <p class="filter-title">Liga</p>

        <div class="selector-tabs">
          <div
            v-for="liga in ligas"
            :key="liga"
            @click="
              selectedLiga = liga;
              selectedCategoria = '';
            "
            :class="['tab', selectedLiga === liga && 'active']"
          >
            {{ liga }}
          </div>
        </div>
      </div>

      <!-- 🔹 CATEGORÍAS -->
      <div class="selector" v-if="selectedLiga">
        <p class="filter-title">Categoría</p>

        <div class="selector-cards">
          <div
            v-for="cat in categorias"
            :key="cat"
            @click="selectedCategoria = cat"
            :class="['category-card', selectedCategoria === cat && 'active']"
          >
            <span>🏆</span>
            <p>{{ cat }}</p>
          </div>
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
/* 🔥 CONTENEDOR */
.container {
  padding: 20px;
  background: #f1f5f9;
}

/* 🔥 FILTROS PRO */
.filters-pro {
  background: white;
  padding: 20px;
  border-radius: 20px;
  border: 1px solid #e5e7eb;
  margin-bottom: 25px;

  display: flex;
  gap: 20px;
  flex-wrap: wrap; /* 🔥 responsive automático */
  align-items: flex-start;
}

/* 🔹 GRUPOS */
.filter-group {
  flex: 1 1 200px;
}

/* 🔹 TITULOS */
.filter-title {
  font-size: 12px;
  font-weight: 600;
  color: #000000;
  margin-bottom: 6px;
}

/* 🔹 CHIPS */
.chips {
  color: #0f172a; /* 🔥 antes podía perderse */
  display: flex;
  flex-wrap: wrap;
  color: #0f172a;
  gap: 8px;
}

.chip {
  padding: 7px 12px;
  border-radius: 999px;
  color: #0f172a; /* 🔥 texto visible */
  border: 1px solid #e5e7eb;
  background: #f8fafc;
  font-size: 12px;
  cursor: pointer;
  transition: 0.2s;
}

.chip:hover {
  transform: translateY(-2px);
}

/* 🔥 ACTIVOS */
.chip.active {
  background: linear-gradient(135deg, #22c55e, #4ade80);
  color: rgb(255, 255, 255);
}

.chip.secondary.active {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
}

/* 🔥 CAMPEÓN */
.champion-side {
  flex: 1 1 220px;
}

.champion-card {
  background: linear-gradient(135deg, #facc15, #fde68a);
  border-radius: 18px;
  padding: 15px;
  color: #78350f;
  text-align: center;
  animation: pop 0.4s ease;
}
.champion-card h3 {
  color: #451a03;
}

.champion-card p {
  color: #78350f;
}

.champion-card img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}

@keyframes pop {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

/* 🔥 EMPTY */
.empty-state {
  text-align: center;
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  border: 1px dashed #cbd5e1;
  font-size: 14px;
  color: #64748b;
}

/* 🔥 PREMIOS (NUEVO LOOK) */
.awards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

/* 🔹 CARD */
.award-card {
  border-radius: 18px;
  padding: 15px;
  text-align: center;
  background: white;
  transition: 0.3s;
  border: 1px solid #e5e7eb;
  position: relative;
  overflow: hidden;
  color: #0f172a; /* 🔥 texto principal visible */
}

/* 🔥 EFECTO HOVER PRO */
.award-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    120deg,
    transparent,
    rgba(255, 255, 255, 0.4),
    transparent
  );
  opacity: 0;
  transition: 0.4s;
}

.award-card:hover::before {
  opacity: 1;
}
.award-card span {
  color: #64748b;
}

.award-card p {
  color: #0f172a;
}

.award-card h3 {
  color: #1e293b;
}
.award-card:hover {
  transform: translateY(-6px);
}

/* 🔹 IMG */
.award-card img {
  width: 55px;
  height: 55px;
  border-radius: 50%;
}

/* 🔹 COLORES */
.mvp {
  background: #fef9c3;
}
.scorer {
  background: #ecfdf5;
}
.defense {
  background: #eff6ff;
}
.keeper {
  background: #f5f3ff;
}

/* 🔥 TABLA PRO */
.table-container {
  background: white;
  border-radius: 18px;
  overflow-x: auto; /* 🔥 scroll en móvil */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

/* 🔹 TABLA */
.table {
  width: 100%;
  min-width: 600px; /* 🔥 evita romper en móvil */
  border-collapse: collapse;
}

/* 🔹 HEADER */
thead {
  background: #0f172a;
}

th {
  padding: 12px;
   color: white; /* 🔥 antes negro sobre fondo oscuro */
  font-size: 12px;
}

/* 🔹 FILAS */
td {
  padding: 12px;
  text-align: center;
  color: #1e293b; /* 🔥 mejor contraste */
}

tbody tr {
  border-bottom: 1px solid #e5e7eb;
}

tbody tr:hover {
  background: #f8fafc;
}

/* 🔹 EQUIPO */
.team {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #0f172a;
  justify-content: flex-start;
}

.team img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
}

/* 🔹 COLORES */
.win {
  color: #16a34a;
}
.lose {
  color: #dc2626;
}
.points {
  font-weight: bold;
   color: #0f172a;
}

/* 📱 RESPONSIVE */
@media (max-width: 768px) {
  .container {
    padding: 15px;
  }

  .filters-pro {
    flex-direction: column;
  }

  .champion-side {
    width: 100%;
  }

  .awards {
    grid-template-columns: repeat(2, 1fr);
  }

  .table {
    font-size: 12px;
  }
}
/* 🔥 SELECTOR BASE */
.selector {
  width: 100%;
}

/* 🔥 TABS (LIGAS) */
.selector-tabs {
  display: flex;
  gap: 10px;
  background: #f1f5f9;
  padding: 6px;
  border-radius: 12px;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
    color: #475569; /* 🔥 gris visible */
  transition: 0.3s;
}

/* 🔥 ACTIVE TAB */
.tab.active {
  background: white;
  color: #0f172a;
  font-weight: bold;
  box-shadow: 0 5px 15px rgba(0,0,0,0.08);
}

/* 🔥 CATEGORÍAS */
.selector-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 10px;
}

/* 🔥 CARD */
.category-card {
  color: #0f172a;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 14px;
  padding: 12px;
  text-align: center;
  cursor: pointer;
  transition: 0.3s;
}
.category-card p {
  color: #1e293b;
}

/* ICON */
.category-card span {
  font-size: 20px;
}

/* TEXTO */
.category-card p {
  margin-top: 5px;
  font-size: 13px;
}

/* HOVER */
.category-card:hover {
  transform: translateY(-3px);
}

/* ACTIVE */
.category-card.active {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
  border: none;
  box-shadow: 0 8px 20px rgba(59,130,246,0.3);
}
</style>
