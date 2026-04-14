<template>
  <div class="referee">

    <!-- PERFIL -->
    <section class="profile">
      <img :src="referee.photo" class="avatar" />

      <div class="info">
        <h1>{{ referee.name }}</h1>
        <p>{{ referee.age }} años • {{ referee.studies }}</p>
      </div>

      <div class="badge">ÁRBITRO</div>
    </section>

    <!-- PARTIDOS -->
    <section class="matches">
      <h2>Partidos asignados</h2>

      <div
        v-for="m in matches"
        :key="m.id"
        class="matchCard"
        @click="selectMatch(m)"
      >
        <div class="teams">
          <span>{{ m.home }}</span>
          <b>VS</b>
          <span>{{ m.away }}</span>
        </div>

        <div class="meta">
          <span>📅 {{ m.date }}</span>
          <span>⏰ {{ m.time }}</span>
          <span>🏟 {{ m.stadium }}</span>
        </div>
      </div>
    </section>

    <!-- MODAL -->
    <div v-if="selectedMatch" class="modal">

      <div class="modalCard">

        <!-- HEADER -->
        <div class="matchHeader">
          <h2>{{ selectedMatch.home }} vs {{ selectedMatch.away }}</h2>
          <button @click="selectedMatch = null">✖</button>
        </div>

        <!-- SCORE -->
        <div class="scoreboard">
          <div>{{ selectedMatch.home }}</div>
          <div class="score">
            {{ stats.home.goals }} - {{ stats.away.goals }}
          </div>
          <div>{{ selectedMatch.away }}</div>
        </div>

        <div class="minute">⏱ {{ minute }}'</div>

        <!-- JUGADORES -->
        <div class="teamsGrid">

          <!-- LOCAL -->
          <div class="team">
            <h3>{{ selectedMatch.home }}</h3>

            <div
              v-for="p in selectedMatch.playersHome"
              :key="p.name"
              class="player"
            >
              <span>{{ p.name }}</span>

              <div class="actionsPro">
                <button class="btn goal" @click="addEvent('goal', p.name, 'home')">⚽</button>
                <button class="btn yellow" @click="addEvent('yellow', p.name, 'home')">🟨</button>
                <button class="btn red" @click="addEvent('red', p.name, 'home')">🟥</button>
              </div>
            </div>
          </div>

          <!-- VISITANTE -->
          <div class="team">
            <h3>{{ selectedMatch.away }}</h3>

            <div
              v-for="p in selectedMatch.playersAway"
              :key="p.name"
              class="player"
            >
              <span>{{ p.name }}</span>

              <div class="actionsPro">
                <button class="btn goal" @click="addEvent('goal', p.name, 'away')">⚽</button>
                <button class="btn yellow" @click="addEvent('yellow', p.name, 'away')">🟨</button>
                <button class="btn red" @click="addEvent('red', p.name, 'away')">🟥</button>
              </div>
            </div>
          </div>

        </div>

        <!-- TIMELINE -->
        <div class="timelineGrid">

          <div class="timeline">
            <h3>🏠 {{ selectedMatch.home }}</h3>
            <div v-for="(e, i) in eventsHome" :key="i" class="event">
              <span class="min">{{ e.minute }}'</span>
              <span>{{ icon(e.type) }}</span>
              <span>{{ e.player }}</span>
            </div>
          </div>

          <div class="timeline">
            <h3>✈ {{ selectedMatch.away }}</h3>
            <div v-for="(e, i) in eventsAway" :key="i" class="event">
              <span class="min">{{ e.minute }}'</span>
              <span>{{ icon(e.type) }}</span>
              <span>{{ e.player }}</span>
            </div>
          </div>

        </div>

        <!-- SAVE -->
        <button class="saveBtn" @click="saveMatch">
          Finalizar Partido
        </button>

      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const referee = {
  name: "Carlos Mendoza",
  age: 34,
  studies: "Árbitro Profesional • Certificación FIFA",
  photo: "https://i.pravatar.cc/120?img=12"
};

const generatePlayers = (prefix) =>
  Array.from({ length: 7 }).map((_, i) => ({
    name: `Jugador ${prefix}${i + 1}`
  }));

const matches = ref([
  {
    id: 1,
    home: "FIFA CLUB PRO",
    away: "REAL STARS",
    date: "10 Oct 2026",
    time: "18:00",
    stadium: "Estadio Central",
    events: [],
    playersHome: generatePlayers("A"),
    playersAway: generatePlayers("B")
  }
]);

const selectedMatch = ref(null);
const minute = ref(0);

const stats = ref({
  home: { goals: 0, yellow: 0, red: 0 },
  away: { goals: 0, yellow: 0, red: 0 }
});

const eventsHome = computed(() =>
  selectedMatch.value?.events.filter(e => e.team === "home") || []
);

const eventsAway = computed(() =>
  selectedMatch.value?.events.filter(e => e.team === "away") || []
);

const selectMatch = (m) => {
  selectedMatch.value = m;
  minute.value = 0;

  stats.value = {
    home: { goals: 0, yellow: 0, red: 0 },
    away: { goals: 0, yellow: 0, red: 0 }
  };
};

const icon = (type) => {
  if (type === "goal") return "⚽";
  if (type === "yellow") return "🟨";
  return "🟥";
};

const addEvent = (type, player, team) => {
  selectedMatch.value.events.push({
    minute: minute.value,
    type,
    player,
    team
  });

  recalcStats();
};

const recalcStats = () => {
  const s = {
    home: { goals: 0, yellow: 0, red: 0 },
    away: { goals: 0, yellow: 0, red: 0 }
  };

  selectedMatch.value.events.forEach(e => {
    s[e.team][e.type === "goal" ? "goals" : e.type]++;
  });

  stats.value = s;
};

setInterval(() => {
  if (selectedMatch.value) minute.value++;
}, 60000);

const saveMatch = () => {
  console.log(selectedMatch.value);
  alert("✅ Partido guardado");
  selectedMatch.value = null;
};
</script>

<style scoped>

/* GENERAL */
.referee {
  background: #f1f5f9;
  padding: 20px;
  font-family: "Inter";
}

/* PROFILE */
.profile {
  display: flex;
  align-items: center;
  gap: 15px;
  background: white;
  padding: 16px;
  border-radius: 16px;
}

.avatar {
  width: 70px;
  border-radius: 50%;
}

.badge {
  margin-left: auto;
  background: #22c55e;
  color: white;
  padding: 6px 10px;
  border-radius: 10px;
}

/* MATCH */
.matchCard {
  background: white;
  padding: 14px;
  border-radius: 12px;
  margin-bottom: 10px;
  cursor: pointer;
}

/* MODAL */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modalCard {
  background: white;
  width: 95%;
  max-width: 1100px;
  border-radius: 16px;
  padding: 15px;
}

/* SCORE */
.scoreboard {
  display: flex;
  justify-content: space-between;
  background: #22c55e;
  color: white;
  padding: 15px;
  border-radius: 12px;
}

.score {
  font-size: 36px;
}

/* GRID */
.teamsGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

/* PLAYER */
.player {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid transparent;
  transition: 0.2s;
}

.player:hover {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

/* BOTONES PRO */
.actionsPro {
  display: flex;
  gap: 6px;
}

.btn {
  width: 34px;
  height: 34px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}

.btn.goal {
  background: #dcfce7;
}

.btn.goal:hover {
  background: #22c55e;
  color: white;
  transform: scale(1.1);
}

.btn.yellow {
  background: #fef9c3;
}

.btn.yellow:hover {
  background: #eab308;
  color: white;
  transform: scale(1.1);
}

.btn.red {
  background: #fee2e2;
}

.btn.red:hover {
  background: #ef4444;
  color: white;
  transform: scale(1.1);
}

/* TIMELINE */
.timelineGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  margin-top: 10px;
}

.timeline {
  background: #f8fafc;
  padding: 10px;
  border-radius: 10px;
}

.event {
  display: flex;
  gap: 8px;
  font-size: 13px;
}

/* SAVE */
.saveBtn {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  background: #22c55e;
  color: white;
  border: none;
  border-radius: 10px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .teamsGrid,
  .timelineGrid {
    grid-template-columns: 1fr;
  }
}

</style>