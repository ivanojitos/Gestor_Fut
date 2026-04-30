<!-- 🔥 VISTA UNIFICADA: PARTIDOS EN CURSO + PROGRAMADOS -->
<template>
  <div class="admin">
    <!-- HEADER -->
    <div class="header">
      <h2>⚽ Gestión de Partidos</h2>

      <div class="actions">
        <button class="secondaryBtn" @click="goToPartidos">
          📋 Ver partidos
        </button>

        <button class="primaryBtn" @click="goToProgramarJuego">
          ➕ Programar juego
        </button>
      </div>
    </div>

    <!-- FILTROS GLOBAL -->
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

      <div class="filterItem">
        <label>🕒 Turno</label>
        <select v-model="filterShift">
          <option value="">Todos</option>
          <option value="morning">🌅 Matutino</option>
          <option value="night">🌙 Nocturno</option>
        </select>
      </div>

      <div class="filterItem">
        <label>📊 Resultado</label>
        <select v-model="filterResult">
          <option value="">Todos</option>
          <option value="win">🟢 Ganados</option>
          <option value="draw">🟡 Empatados</option>
          <option value="loss">🔴 Perdidos</option>
        </select>
      </div>

      <button class="clearBtn" @click="clearFilters">❌ Limpiar</button>
    </div>

    <!-- RESUMEN ARBITROS -->
    <div class="refereeSummary">
      <div v-for="(count, ref) in refereeCount" :key="ref" class="refItem">
        👨‍⚖ {{ ref }}: <b>{{ count }}</b>
      </div>
    </div>

    <!-- LISTA UNIFICADA -->
    <div class="list">
      <div v-for="m in filteredMatches" :key="m.id" class="card">
        <div class="top">
          <span>🏆 {{ m.league }}</span>
          <span>📂 {{ m.category }}</span>
        </div>

        <div class="teams">
          <b>{{ m.home }} {{ m.homeScore ?? 0 }}</b>
          <span class="vs">VS</span>
          <b>{{ m.away }} {{ m.awayScore ?? 0 }}</b>
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

const goBack = () => router.back();
const goToProgramarJuego = () => router.push({ name: "ProgramarJuego" });

const goToPartidos = () => {
  router.push({ name: "PartidosProgramados" });
};
/* DATA */
const matches = ref([
  {
    id: 1,
    home: "Real Madrid",
    away: "Barcelona",
    homeScore: 2,
    awayScore: 1,
    date: "2026-04-20",
    time: "18:00",
    field: "Cancha 1",
    referee: "Carlos",
    league: "Liga MX",
    category: "Libre",
  },
  {
    id: 2,
    home: "Tigres",
    away: "Águilas",
    homeScore: 1,
    awayScore: 1,
    date: "2026-04-20",
    time: "08:30",
    field: "Cancha 2",
    referee: "Luis",
    league: "Liga Premier",
    category: "Sub-20",
  },
]);

/* FILTROS */
const filterDate = ref("");
const filterLeague = ref("");
const filterCategory = ref("");
const filterShift = ref("");
const filterResult = ref("");

const leagues = [...new Set(matches.value.map((m) => m.league))];
const categories = [...new Set(matches.value.map((m) => m.category))];

const filteredMatches = computed(() => {
  return matches.value.filter((m) => {
    const hour = parseInt(m.time.split(":")[0]);

    const isMorning = hour >= 6 && hour < 12;
    const isNight = hour >= 18;

    let shiftOk = true;
    if (filterShift.value === "morning") shiftOk = isMorning;
    if (filterShift.value === "night") shiftOk = isNight;

    let resultOk = true;
    if (filterResult.value === "win") resultOk = m.homeScore > m.awayScore;
    if (filterResult.value === "draw") resultOk = m.homeScore === m.awayScore;
    if (filterResult.value === "loss") resultOk = m.homeScore < m.awayScore;

    return (
      (!filterDate.value || m.date === filterDate.value) &&
      (!filterLeague.value || m.league === filterLeague.value) &&
      (!filterCategory.value || m.category === filterCategory.value) &&
      shiftOk &&
      resultOk
    );
  });
});

const refereeCount = computed(() => {
  const c = {};
  filteredMatches.value.forEach((m) => {
    c[m.referee] = (c[m.referee] || 0) + 1;
  });
  return c;
});

const clearFilters = () => {
  filterDate.value = "";
  filterLeague.value = "";
  filterCategory.value = "";
  filterShift.value = "";
  filterResult.value = "";
};
</script>

<style scoped>
/* CONTENEDOR BOTONES */
.actions {
  display: flex;
  gap: 10px;
}
/* BOTÓN PRINCIPAL (acción importante) */
.primaryBtn {
  background: #3b82f6;
  color: white;
  padding: 10px 14px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}
.primaryBtn:hover {
  background: #2563eb;
}

/* BOTÓN SECUNDARIO */
.secondaryBtn {
  background: white;
  color: #0f172a;
  padding: 10px 14px;
  border: 1px solid #cbd5e1;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: 0.2s;
}

.secondaryBtn:hover {
  background: #e0f2fe;
}
.admin {
  padding: 20px;
  font-family: sans-serif;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
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

input,
select {
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #ccc;
}

.createBtn {
  background: #22c55e;
  color: white;
  padding: 10px;
  border: none;
  border-radius: 10px;
}

.clearBtn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 8px;
}

.list {
  display: grid;
  gap: 15px;
  margin-top: 20px;
}

.card {
  background: white;
  padding: 15px;
  border-radius: 12px;
  border-left: 5px solid #3b82f6;
}

.top {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
}

.teams {
  text-align: center;
  font-size: 18px;
  font-weight: bold;
}

.vs {
  margin: 0 10px;
  color: #ef4444;
}

.info {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
  font-size: 12px;
}

.refereeSummary {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.refItem {
  background: #e0f2fe;
  padding: 5px 10px;
  border-radius: 20px;
}

.empty {
  text-align: center;
  margin-top: 20px;
  color: gray;
}
</style>
