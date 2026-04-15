<template>
  <div class="admin">
    <section class="liveSection">
      <h2>🔴 Partidos en curso</h2>

      <!-- FILTROS -->
      <div class="filtersRow">

        <!-- IZQUIERDA -->
        <div class="filters">

          <input type="date" v-model="filterDate" />

          <select v-model="filterShift">
            <option value="">Todos los turnos</option>
            <option value="morning">🌅 Matutino</option>
            <option value="night">🌙 Nocturno</option>
          </select>

          <!-- NUEVO FILTRO -->
          <select v-model="filterResult">
            <option value="">📊 Resultado</option>
            <option value="win">🟢 Ganados</option>
            <option value="draw">🟡 Empatados</option>
            <option value="loss">🔴 Perdidos</option>
          </select>

          <button class="createBtn" @click="goToProgramarJuego">
            ➕ Programar juego
          </button>
        </div>

        <!-- DERECHA -->
        <div class="refereeSummary">
          <div v-for="(count, ref) in refereeCount" :key="ref" class="refItem">
            👨‍⚖ {{ ref }}: <b>{{ count }}</b>
          </div>
        </div>

      </div>

      <!-- LISTA -->
      <div v-for="m in filteredMatches" :key="m.id" class="liveCard">

        <div class="liveTeams">
          <b>{{ m.home }} {{ m.homeScore ?? 0 }}</b>
          <span class="vs">VS</span>
          <b>{{ m.away }} {{ m.awayScore ?? 0 }}</b>
        </div>

        <div class="liveInfo">
          <span>📅 {{ m.date }}</span>
          <span>⏰ {{ m.time }}</span>
          <span>🏟 {{ m.field }}</span>
          <span>👨‍⚖ {{ m.referee }}</span>
        </div>

      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

/* FILTROS */
const filterDate = ref("");
const filterShift = ref("");
const filterResult = ref(""); // 👈 NUEVO

/* PARTIDOS */
const liveMatches = ref([
  {
    id: 1,
    home: "FIFA CLUB",
    away: "REAL STARS",
    homeScore: 2,
    awayScore: 1,
    date: "2026-04-14",
    time: "08:30",
    field: "Cancha 1",
    referee: "Carlos Mendoza",
  },
  {
    id: 2,
    home: "Águilas",
    away: "Tigres",
    homeScore: 1,
    awayScore: 1,
    date: "2026-04-14",
    time: "19:30",
    field: "Cancha 2",
    referee: "Luis Pérez",
  },
  {
    id: 3,
    home: "Leones",
    away: "Dragones",
    homeScore: 0,
    awayScore: 3,
    date: "2026-04-15",
    time: "10:00",
    field: "Cancha 1",
    referee: "Pedro Ruiz",
  },
]);

const goToProgramarJuego = () => {
  router.push("/dashboard/programarJuego");
};

/* FILTRADO PRINCIPAL */
const filteredMatches = computed(() => {
  return liveMatches.value.filter((m) => {
    const hour = parseInt(m.time.split(":")[0]);

    const isMorning = hour >= 6 && hour < 12;
    const isNight = hour >= 18;

    const dateOk = !filterDate.value || m.date === filterDate.value;

    let shiftOk = true;
    if (filterShift.value === "morning") shiftOk = isMorning;
    if (filterShift.value === "night") shiftOk = isNight;

    /* RESULTADO */
    let resultOk = true;

    if (filterResult.value === "win") {
      resultOk = (m.homeScore ?? 0) > (m.awayScore ?? 0);
    }

    if (filterResult.value === "draw") {
      resultOk = (m.homeScore ?? 0) === (m.awayScore ?? 0);
    }

    if (filterResult.value === "loss") {
      resultOk = (m.homeScore ?? 0) < (m.awayScore ?? 0);
    }

    return dateOk && shiftOk && resultOk;
  });
});

/* ARBITROS */
const refereeCount = computed(() => {
  const count = {};

  filteredMatches.value.forEach((m) => {
    if (!m.referee) return;
    count[m.referee] = (count[m.referee] || 0) + 1;
  });

  return count;
});
</script>

<style scoped>
.admin {
  padding: 20px;
  font-family: sans-serif;
}

/* HEADER FILTROS */
.filtersRow {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 10px;
}

/* FILTROS */
.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filters input,
.filters select {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}

/* BOTÓN */
.createBtn {
  background: #22c55e;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
}

.createBtn:hover {
  background: #16a34a;
}

/* ARBITROS */
.refereeSummary {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.refItem {
  background: #e0f2fe;
  padding: 6px 10px;
  border-radius: 20px;
  font-size: 12px;
}

/* CARD */
.liveCard {
  background: #fff;
  padding: 16px;
  border-radius: 14px;
  margin-top: 10px;
  border-left: 6px solid #ef4444;
}

.liveTeams {
  text-align: center;
  font-weight: bold;
  margin-bottom: 8px;
}

.vs {
  color: #ef4444;
  margin: 0 10px;
  font-weight: bold;
}

.liveInfo {
  display: flex;
  justify-content: center;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 13px;
  color: #475569;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .filtersRow {
    flex-direction: column;
  }
}
</style>