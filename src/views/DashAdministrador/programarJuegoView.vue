<template>
  <div class="admin">
    <!-- HEADER -->
    <div class="header">
      <div>
        <h2 class="title">⚽ Programar Partido</h2>
        <p class="subtitle">Gestión de encuentros deportivos</p>
      </div>

      <!-- 🔥 BOTONES AGRUPADOS -->
      <div class="actions">
        <button class="secondaryBtn" @click="goToPartidos">
          📋 Ver partidos
        </button>

        <button class="backBtn" @click="goBack">
          ← Regresar
        </button>
      </div>
    </div>

    <!-- FILTROS -->
    <div class="filters">
      <select v-model="selectedLeague">
        <option value="">🏆 Liga</option>
        <option v-for="l in leagues" :key="l">{{ l }}</option>
      </select>

      <select v-model="selectedCategory">
        <option value="">📂 Categoría</option>
        <option v-for="c in categories" :key="c">{{ c }}</option>
      </select>
    </div>

    <div class="container">
      <!-- EQUIPOS -->
      <div class="card">
        <h3>Equipos</h3>

        <div class="slotSelector">
          <button
            :class="{ active: teamSlot === 'home' }"
            @click="teamSlot = 'home'"
          >
            🏠 Local: {{ selected.home || "Seleccionar" }}
          </button>

          <button
            :class="{ active: teamSlot === 'away' }"
            @click="teamSlot = 'away'"
          >
            ✈ Visitante: {{ selected.away || "Seleccionar" }}
          </button>
        </div>

        <div class="teamList">
          <div
            v-for="team in filteredTeams"
            :key="team.name"
            class="teamItem"
            @click="selectTeam(team.name)"
          >
            <span>⚽ {{ team.name }}</span>

            <span v-if="teamMatchCount[team.name]" class="badge">
              {{ teamMatchCount[team.name] }}
            </span>
          </div>
        </div>
      </div>

      <!-- CANCHA -->
      <div class="card fieldCard">
        <div class="pitch">
          <div class="score">⏰ {{ selected.time || "--:--" }}</div>

          <div class="teams">
            <span class="home">{{ selected.home || "LOCAL" }}</span>
            <span class="away">{{ selected.away || "VISITA" }}</span>
          </div>

          <div class="line"></div>
          <div class="circle"></div>

          <div class="info">
            🏟 {{ selected.field || "Cancha" }} · 👨‍⚖
            {{ selected.referee || "Árbitro" }} · 📅 {{ selected.date || "--" }}
          </div>
        </div>
      </div>

      <!-- CONFIG -->
      <div class="card config">
        <h3 class="configTitle">⚙️ Configuración</h3>

        <div class="formGrid">
          <div class="field">
            <label>Árbitro</label>
            <select v-model="selected.referee">
              <option disabled value="">Seleccionar árbitro</option>
              <option v-for="r in referees" :key="r">{{ r }}</option>
            </select>
          </div>

          <div class="field">
            <label>Cancha</label>
            <select v-model="selected.field">
              <option disabled value="">Seleccionar cancha</option>
              <option v-for="f in fields" :key="f">{{ f }}</option>
            </select>
          </div>

          <div class="field">
            <label>Fecha</label>
            <input type="date" v-model="selected.date" />
          </div>

          <div class="field">
            <label>Hora</label>
            <input type="time" v-model="selected.time" />
          </div>
        </div>

        <button class="saveBtn" @click="saveMatch">
          💾 Guardar Partido
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

/* FILTROS */
const selectedLeague = ref("");
const selectedCategory = ref("");

const leagues = ["Liga MX", "Liga Premier"];
const categories = ["Sub-20", "Sub-17", "Libre"];

/* EQUIPOS */
const teams = [
  { name: "Real Madrid", league: "Liga MX", category: "Libre" },
  { name: "Barcelona", league: "Liga MX", category: "Sub-20" },
  { name: "Servimsa", league: "Liga Premier", category: "Libre" },
  { name: "Águilas", league: "Liga MX", category: "Sub-17" },
  { name: "Tigres", league: "Liga Premier", category: "Sub-20" },
];

const goBack = () => router.back();

const goToPartidos = () => {
  router.push({ name: "partidosProgramados" });
};

/* FILTRO */
const filteredTeams = computed(() =>
  teams.filter(
    (t) =>
      (!selectedLeague.value || t.league === selectedLeague.value) &&
      (!selectedCategory.value || t.category === selectedCategory.value),
  ),
);

/* LOCAL / VISITANTE */
const teamSlot = ref("home");

const selected = ref({
  home: null,
  away: null,
  referee: "",
  field: "",
  date: "",
  time: "",
});

const referees = ["Carlos", "Luis", "Pedro"];
const fields = ["Cancha 1", "Cancha 2", "Cancha 3"];

const matches = ref([]);

/* SELECCIONAR */
const selectTeam = (team) => {
  selected.value[teamSlot.value] = team;
};

/* GUARDAR */
const saveMatch = () => {
  if (
    !selected.value.home ||
    !selected.value.away ||
    !selected.value.referee ||
    !selected.value.field ||
    !selected.value.date ||
    !selected.value.time
  ) {
    return alert("Completa todos los campos");
  }

  matches.value.push({ ...selected.value });

  selected.value = {
    home: null,
    away: null,
    referee: "",
    field: "",
    date: "",
    time: "",
  };
};

/* CONTADOR */
const teamMatchCount = computed(() => {
  const c = {};

  matches.value.forEach((m) => {
    if (!m.home || !m.away) return;

    c[m.home] = (c[m.home] || 0) + 1;
    c[m.away] = (c[m.away] || 0) + 1;
  });

  return c;
});
</script>

<style scoped>
.admin {
  min-height: 100vh;
  padding: 25px;
  font-family: Inter, sans-serif;
  background: #f8fafc;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* 🔥 ACCIONES */
.actions {
  display: flex;
  gap: 10px;
}

/* BOTÓN SECUNDARIO */
.secondaryBtn {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #cbd5e1;
  background: white;
  cursor: pointer;
  font-weight: 500;
}

.secondaryBtn:hover {
  background: #e0f2fe;
}

/* BOTÓN REGRESAR */
.backBtn {
  padding: 10px 14px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: white;
  cursor: pointer;
}

.backBtn:hover {
  background: #f1f5f9;
}

/* RESTO IGUAL */
.filters {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

select,
input {
  padding: 10px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: white;
}

.container {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 20px;
}

@media (max-width: 900px) {
  .container {
    grid-template-columns: 1fr;
  }
}

.card {
  background: white;
  border-radius: 16px;
  padding: 15px;
  border: 1px solid #e2e8f0;
}

.slotSelector {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.slotSelector button {
  flex: 1;
  padding: 10px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  background: #e2e8f0;
}

.slotSelector .active {
  background: #0f172a;
  color: white;
}

.teamItem {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
}

.teamItem:hover {
  background: #f1f5f9;
}

.badge {
  background: #334155;
  color: white;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
}

.fieldCard {
  display: flex;
  align-items: center;
  justify-content: center;
}

.pitch {
  position: relative;
  width: 100%;
  height: 360px;
  border-radius: 16px;
  background: linear-gradient(135deg, #1f6f3f, #2f8f4e);
}

.line {
  position: absolute;
  width: 2px;
  height: 100%;
  background: rgba(255, 255, 255, 0.7);
  left: 50%;
}

.circle {
  position: absolute;
  width: 90px;
  height: 90px;
  border: 2px solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.score {
  position: absolute;
  top: 10px;
  width: 100%;
  text-align: center;
  color: white;
}

.teams {
  position: absolute;
  top: 50%;
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 0 25px;
  color: white;
}

.info {
  position: absolute;
  bottom: 10px;
  width: 90%;
  left: 5%;
  text-align: center;
  background: white;
  padding: 8px;
  border-radius: 10px;
  font-size: 12px;
}
</style>