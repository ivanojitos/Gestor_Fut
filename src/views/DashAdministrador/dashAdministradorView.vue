<template>
  <div class="admin">
    <!-- PARTIDOS EN CURSO -->
    <section class="liveSection">
      <h2>🔴 Partidos en curso</h2>

      <div v-for="m in liveMatches" :key="m.id" class="liveCard">
        <div class="liveTeams">
          <b>{{ m.home }}</b>
          <span class="vs">VS</span>
          <b>{{ m.away }}</b>
        </div>

        <div class="liveInfo">
          <span>📅 {{ m.date }}</span>
          <span>⏰ {{ m.time }}</span>
          <span>🏟 {{ m.field }}</span>
          <span>👨‍⚖ {{ m.referee }}</span>
        </div>
      </div>
    </section>

    <!-- BOTONES -->
    <button class="createBtn" @click="showCreator = true">
      ➕ Programar Partido
    </button>

    <button class="viewBtn" @click="showViewer = !showViewer">
      📅 Ver Partidos
    </button>

    <!-- VIEWER -->
    <div v-if="showViewer" class="viewer">
      <h2>📆 Partidos por fecha</h2>

      <input type="date" v-model="filterDate" />

      <div v-for="m in filteredMatches" :key="m.id" class="liveCard">
        <div class="liveTeams">
          <b>{{ m.home }}</b> VS <b>{{ m.away }}</b>
        </div>
        <div class="liveInfo">
          <span>⏰ {{ m.time }}</span>
          <span>🏟 {{ m.field }}</span>
          <span>👨‍⚖ {{ m.referee }}</span>
        </div>
      </div>

      <h3>👨‍⚖ Carga de árbitros</h3>
      <div v-for="(count, ref) in refereeCount" :key="ref">
        {{ ref }} → {{ count }} partidos
      </div>
    </div>

    <!-- CREATOR -->
    <div v-if="showCreator" class="creator">
      <h2>⚙️ Programar nuevo partido</h2>

      <div class="grid">
        <!-- EQUIPOS -->
        <div class="panel">
          <h3>Equipos</h3>

          <div class="teamSelector">
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

          <div
            v-for="team in teams"
            :key="team"
            class="item"
            :class="{ disabled: isTeamDisabled(team) }"
            @click="!isTeamDisabled(team) && selectTeam(team)"
          >
            {{ team }}
          </div>
        </div>

        <!-- ARBITROS -->
        <div class="panel">
          <h3>Árbitros</h3>
          <div
            v-for="ref in referees"
            :key="ref"
            class="item"
            @click="selected.referee = ref"
          >
            {{ ref }}
          </div>
        </div>

        <!-- CANCHAS -->
        <div class="panel">
          <h3>Canchas</h3>
          <div
            v-for="field in fields"
            :key="field"
            class="item"
            @click="selected.field = field"
          >
            {{ field }}
          </div>
        </div>

        <!-- HORARIO -->
        <div class="panel">
          <h3>Horario</h3>
          <input type="date" v-model="selected.date" />
          <input type="time" v-model="selected.time" />
        </div>
      </div>

      <!-- PREVIEW -->
      <div class="fieldPreview">
        <div class="pitch">
          <div class="team left">{{ selected.home || "LOCAL" }}</div>
          <div class="vsCenter">VS</div>
          <div class="team right">{{ selected.away || "VISITA" }}</div>

          <div class="details">
            <p>🏟 {{ selected.field || "Cancha" }}</p>
            <p>👨‍⚖ {{ selected.referee || "Árbitro" }}</p>
            <p>📅 {{ selected.date }}</p>
            <p>⏰ {{ selected.time }}</p>
          </div>
        </div>
      </div>

      <button class="saveBtn" @click="saveMatch">
        Guardar Partido
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const showCreator = ref(false);
const showViewer = ref(false);
const teamSlot = ref("home");
const filterDate = ref("");

const liveMatches = ref([
  {
    id: 1,
    home: "FIFA CLUB",
    away: "REAL STARS",
    date: "Hoy",
    time: "18:00",
    field: "Cancha 1",
    referee: "Carlos Mendoza",
  },
]);

const teams = ["Águilas", "Tigres", "Leones", "Dragones"];
const referees = ["Carlos", "Luis", "Pedro"];
const fields = ["Cancha 1", "Cancha 2"];

const allMatches = ref([]);

const selected = ref({
  home: null,
  away: null,
  referee: null,
  field: null,
  date: "",
  time: "",
});

const selectTeam = (team) => {
  selected.value[teamSlot.value] = team;
};

const saveMatch = () => {
  if (
    !selected.value.home ||
    !selected.value.away ||
    !selected.value.referee ||
    !selected.value.field ||
    !selected.value.date ||
    !selected.value.time
  ) {
    alert("⚠️ Completa todos los campos");
    return;
  }

  allMatches.value.push({
    ...selected.value,
    id: Date.now(),
  });

  alert("✅ Partido programado");

  selected.value = {
    home: null,
    away: null,
    referee: null,
    field: null,
    date: "",
    time: "",
  };
};

const filteredMatches = computed(() => {
  if (!filterDate.value) return allMatches.value;
  return allMatches.value.filter((m) => m.date === filterDate.value);
});

const refereeCount = computed(() => {
  const count = {};
  filteredMatches.value.forEach((m) => {
    if (!m.referee) return;
    count[m.referee] = (count[m.referee] || 0) + 1;
  });
  return count;
});

const isTeamDisabled = (team) => {
  if (!selected.value.date) return false;

  return allMatches.value.some(
    (m) =>
      m.date === selected.value.date &&
      (m.home === team || m.away === team)
  );
};
</script>

<style scoped>
.viewBtn {
  margin: 10px 0;
  padding: 10px;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
}

.viewBtn:hover {
  background: #0284c7;
}

.viewer {
  background: #f8fafc;
  padding: 15px;
  border-radius: 12px;
  margin-top: 10px;
}
.disabled {
  opacity: 0.4;
  pointer-events: none;
}
.admin {
  padding: 20px;
  font-family: sans-serif;
}

/* LIVE */
.liveCard {
  background: #fff;
  padding: 15px;
  border-radius: 12px;
  margin-bottom: 10px;
  border-left: 5px solid red;
}

.liveTeams {
  font-size: 16px;
  text-align: center;
}

.vs {
  margin: 0 10px;
  color: red;
}

.liveInfo {
  font-size: 12px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

/* BOTÓN */
.createBtn {
  margin: 15px 0;
  padding: 12px;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 10px;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
}

.panel {
  background: #fff;
  padding: 10px;
  border-radius: 10px;
}

/* SELECTOR */
.teamSelector {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
}

.teamSelector button {
  flex: 1;
  padding: 8px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  background: #f8fafc;
  cursor: pointer;
  font-size: 12px;
}

.teamSelector button.active {
  background: #22c55e;
  color: white;
  font-weight: bold;
}

/* ITEMS */
.item {
  padding: 8px;
  background: #f1f5f9;
  margin: 5px 0;
  cursor: pointer;
}

.item:hover {
  background: #22c55e;
  color: white;
}

/* CANCHA */
.fieldPreview {
  margin-top: 20px;
}

.pitch {
  background: green;
  color: white;
  padding: 30px;
  border-radius: 20px;
  text-align: center;
  position: relative;
}

.team {
  font-weight: bold;
}

.left {
  position: absolute;
  left: 10px;
  top: 40%;
}

.right {
  position: absolute;
  right: 10px;
  top: 40%;
}

.vsCenter {
  font-size: 20px;
}

.details {
  margin-top: 20px;
  font-size: 13px;
}

/* SAVE */
.saveBtn {
  width: 100%;
  padding: 12px;
  margin-top: 15px;
  background: #16a34a;
  color: white;
  border: none;
  border-radius: 10px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
}
</style>
