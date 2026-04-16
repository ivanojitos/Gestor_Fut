<template>
  <div class="admin">

    <!-- HEADER -->
    <div class="header">
      <button class="backBtn" @click="goBack">← Regresar</button>
      <h2>📋 Partidos Programados</h2>
    </div>

    <!-- FILTROS -->
    <div class="filters">

      <div class="filterItem">
        <label>📅 Fecha</label>
        <input type="date" v-model="filterDate" />
      </div>

      <div class="filterItem">
        <label>🏆 Liga</label>
        <select v-model="filterLeague">
          <option value="">Todas</option>
          <option v-for="l in leagues" :key="l">{{ l }}</option>
        </select>
      </div>

      <div class="filterItem">
        <label>📂 Categoría</label>
        <select v-model="filterCategory">
          <option value="">Todas</option>
          <option v-for="c in categories" :key="c">{{ c }}</option>
        </select>
      </div>

      <button class="clearBtn" @click="clearFilters">
        ❌ Limpiar
      </button>

    </div>

    <!-- LISTA -->
    <div class="list">
      <div
        v-for="(m, index) in filteredMatches"
        :key="index"
        class="card"
      >

        <div class="top">
          <span>🏆 {{ m.league }}</span>
          <span>📂 {{ m.category }}</span>
        </div>

        <div class="teams">
          <b>{{ m.home }}</b>
          <span class="vs">VS</span>
          <b>{{ m.away }}</b>
        </div>

        <div class="info">
          <span>📅 {{ m.date }}</span>
          <span>⏰ {{ m.time }}</span>
          <span>🏟 {{ m.field }}</span>
          <span>👨‍⚖ {{ m.referee }}</span>
        </div>

      </div>
    </div>

    <p v-if="!filteredMatches.length" class="empty">
      No hay partidos con esos filtros
    </p>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

/* NAV */
const goBack = () => router.back();

/* DATA (ejemplo + localStorage) */
const exampleMatches = [
  {
    home: "Real Madrid",
    away: "Barcelona",
    referee: "Carlos",
    field: "Cancha 1",
    date: "2026-04-20",
    time: "18:00",
    league: "Liga MX",
    category: "Libre",
  },
  {
    home: "Tigres",
    away: "Águilas",
    referee: "Luis",
    field: "Cancha 2",
    date: "2026-04-20",
    time: "20:00",
    league: "Liga Premier",
    category: "Sub-20",
  },
];

const stored = JSON.parse(localStorage.getItem("matches"));
const matches = ref(stored && stored.length ? stored : exampleMatches);

/* FILTROS */
const filterDate = ref("");
const filterLeague = ref("");
const filterCategory = ref("");

const leagues = [...new Set(matches.value.map(m => m.league))];
const categories = [...new Set(matches.value.map(m => m.category))];

/* FILTRADO */
const filteredMatches = computed(() => {
  return matches.value.filter(m =>
    (!filterDate.value || m.date === filterDate.value) &&
    (!filterLeague.value || m.league === filterLeague.value) &&
    (!filterCategory.value || m.category === filterCategory.value)
  );
});

/* LIMPIAR */
const clearFilters = () => {
  filterDate.value = "";
  filterLeague.value = "";
  filterCategory.value = "";
};
</script>

<style scoped>
.admin {
  padding: 20px;
  font-family: sans-serif;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* FILTROS */
.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  background: white;
  padding: 15px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.filterItem {
  display: flex;
  flex-direction: column;
  font-size: 12px;
}

input, select {
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
  min-width: 140px;
}

/* BOTONES */
.clearBtn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
}

.clearBtn:hover {
  background: #dc2626;
}

.backBtn {
  padding: 8px 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  background: white;
  cursor: pointer;
}

/* LISTA */
.list {
  display: grid;
  gap: 15px;
  margin-top: 20px;
}

/* CARD */
.card {
  background: white;
  padding: 15px;
  border-radius: 12px;
  border-left: 5px solid #3b82f6;
}

/* TOP */
.top {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  margin-bottom: 8px;
}

/* TEAMS */
.teams {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

.vs {
  margin: 0 10px;
  color: #ef4444;
}

/* INFO */
.info {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  font-size: 12px;
  margin-top: 10px;
}

/* EMPTY */
.empty {
  text-align: center;
  margin-top: 20px;
  color: gray;
}
</style>