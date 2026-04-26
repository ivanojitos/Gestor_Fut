<template>
  <div class="referee">
    <!-- PERFIL -->
    <section class="profile">
      <img :src="referee.photo" class="avatar" />

      <div class="info">
        <h1>{{ referee.Nombre }}</h1>
        <p>{{ referee.Edad }} años • {{ referee.Estudios }}</p>
      </div>

      <div class="badge">ÁRBITRO</div>

      <!-- ✏️ EDITAR -->
      <button class="editBtn" @click="openEdit">✏️</button>
    </section>

    <!-- PARTIDOS -->
    <section class="matches">
      <h2 class="sectionTitle">⚽ Partidos asignados</h2>

      <div
        v-for="m in matches"
        :key="m.id"
        class="matchCardPro"
        @click="selectMatch(m)"
      >
        <!-- TOP -->
        <div class="matchTop">
          <span class="matchDate">📅 {{ m.date }}</span>
          <span class="matchTime">⏰ {{ m.time }}</span>
        </div>

        <!-- TEAMS -->
        <div class="matchTeams">
          <div class="teamName">{{ m.home }}</div>

          <div class="vsBadge">VS</div>

          <div class="teamName">{{ m.away }}</div>
        </div>

        <!-- BOTTOM -->
        <div class="matchBottom">
          <span class="stadium">🏟 {{ m.stadium }}</span>
        </div>
      </div>
    </section>

    <!-- MODAL -->
    <div v-if="selectedMatch" class="modal">
      <div class="modalCard">
        <!-- HEADER -->
        <div class="matchHeader">
          <h2>{{ selectedMatch.home }} vs {{ selectedMatch.away }}</h2>
          <button class="closeBtn" @click="selectedMatch = null">✖</button>
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
          <div class="teamCard">
            <div class="teamHeader">
              <h3>🏠 {{ selectedMatch.home }}</h3>
              <span class="teamStats">
                ⚽ {{ stats.home.goals }} • 🟨 {{ stats.home.yellow }} • 🟥
                {{ stats.home.red }}
              </span>
            </div>

            <div class="playersList">
              <div
                v-for="p in selectedMatch.playersHome"
                :key="p.name"
                class="playerRow"
              >
                <span class="playerName">{{ p.name }}</span>

                <div class="actionsPro">
                  <button
                    class="btn goal"
                    @click="addEvent('goal', p.name, 'home')"
                  >
                    ⚽
                  </button>
                  <button
                    class="btn yellow"
                    @click="addEvent('yellow', p.name, 'home')"
                  >
                    🟨
                  </button>
                  <button
                    class="btn red"
                    @click="addEvent('red', p.name, 'home')"
                  >
                    🟥
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- VISITANTE -->
          <div class="teamCard">
            <div class="teamHeader">
              <h3>✈ {{ selectedMatch.away }}</h3>
              <span class="teamStats">
                ⚽ {{ stats.away.goals }} • 🟨 {{ stats.away.yellow }} • 🟥
                {{ stats.away.red }}
              </span>
            </div>

            <div class="playersList">
              <div
                v-for="p in selectedMatch.playersAway"
                :key="p.name"
                class="playerRow"
              >
                <span class="playerName">{{ p.name }}</span>

                <div class="actionsPro">
                  <button
                    class="btn goal"
                    @click="addEvent('goal', p.name, 'away')"
                  >
                    ⚽
                  </button>
                  <button
                    class="btn yellow"
                    @click="addEvent('yellow', p.name, 'away')"
                  >
                    🟨
                  </button>
                  <button
                    class="btn red"
                    @click="addEvent('red', p.name, 'away')"
                  >
                    🟥
                  </button>
                </div>
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
              <span class="playerName">{{ e.player }}</span>

              <!-- BOTÓN ELIMINAR -->
              <button class="deleteBtn" @click="removeEvent(i, 'home')">
                ✖
              </button>
            </div>
          </div>

          <div class="timeline">
            <h3>✈ {{ selectedMatch.away }}</h3>
            <div v-for="(e, i) in eventsAway" :key="i" class="event">
              <span class="min">{{ e.minute }}'</span>
              <span>{{ icon(e.type) }}</span>
              <span class="playerName">{{ e.player }}</span>

              <!-- BOTÓN ELIMINAR -->
              <button class="deleteBtn" @click="removeEvent(i, 'away')">
                ✖
              </button>
            </div>
          </div>
        </div>

        <!-- SAVE -->
        <button class="saveBtn" @click="saveMatch">Finalizar Partido</button>
      </div>
    </div>
  </div>
  <!-- ✏️ MODAL EDITAR PERFIL -->
  <div v-if="showEdit" class="modal">
    <div class="modalCard editCard">
      <h2>Editar Perfil</h2>

      <input v-model="editForm.Nombre" placeholder="Nombre" />
      <input v-model="editForm.Edad" type="number" placeholder="Edad" />
      <input v-model="editForm.Estudios" placeholder="Estudios" />
      <input v-model="editForm.Direccion" placeholder="Dirección" />
      <input v-model="editForm.Celular" placeholder="Celular" />
      <input v-model="editForm.Correo" placeholder="Correo" />

      <div class="editActions">
        <button class="saveBtn" @click="saveProfile">Guardar cambios</button>

        <button class="cancelBtn" @click="showEdit = false">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";

const referee = ref({
  Nombre: "",
  Edad: "",
  Estudios: "",
  Direccion: "",
  Celular: "",
  Correo: "",
  photo: "https://i.pravatar.cc/120?img=12",
});

const generatePlayers = (prefix) =>
  Array.from({ length: 7 }).map((_, i) => ({
    name: `Jugador ${prefix}${i + 1}`,
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
    playersAway: generatePlayers("B"),
  },
]);

const selectedMatch = ref(null);
const minute = ref(0);

const stats = ref({
  home: { goals: 0, yellow: 0, red: 0 },
  away: { goals: 0, yellow: 0, red: 0 },
});

const eventsHome = computed(
  () => selectedMatch.value?.events.filter((e) => e.team === "home") || [],
);

const eventsAway = computed(
  () => selectedMatch.value?.events.filter((e) => e.team === "away") || [],
);

const selectMatch = (m) => {
  selectedMatch.value = m;
  minute.value = 0;

  stats.value = {
    home: { goals: 0, yellow: 0, red: 0 },
    away: { goals: 0, yellow: 0, red: 0 },
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
    team,
  });

  recalcStats();
};

const recalcStats = () => {
  const s = {
    home: { goals: 0, yellow: 0, red: 0 },
    away: { goals: 0, yellow: 0, red: 0 },
  };

  selectedMatch.value.events.forEach((e) => {
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

const removeEvent = (index, team) => {
  const filtered = team === "home" ? eventsHome.value : eventsAway.value;

  const eventToRemove = filtered[index];

  const realIndex = selectedMatch.value.events.findIndex(
    (e) => e === eventToRemove,
  );

  if (realIndex !== -1) {
    selectedMatch.value.events.splice(realIndex, 1);
    recalcStats();
  }
};

const showEdit = ref(false);

const editForm = ref({
  Nombre: "",
  Edad: "",
  Estudios: "",
  Direccion: "",
  Celular: "",
  Correo: "",
});

// abrir modal y cargar datos
const openEdit = () => {
  editForm.value = { ...referee.value };
  showEdit.value = true;
};

const saveProfile = async () => {
  try {
    await axios.put(
      `https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net/api/arbitro/${referee.value.Id}`,
      editForm.value,
    );

    // 🔥 actualizar datos en pantalla
    referee.value = { ...editForm.value };

    alert("✅ Datos actualizados");
    showEdit.value = false;
  } catch (error) {
    console.error(error);
    alert("❌ Error al actualizar");
  }
};
onMounted(async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await axios.get(
      `https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net/api/arbitro/${user.Id}`,
    );

    referee.value = res.data;
  } catch (error) {
    console.error("Error cargando árbitro", error);
  }
});
</script>

<style scoped>
/* BOTÓN EDITAR */
.editBtn {
  margin-left: auto;
  background: #e0f2fe;
  border: none;
  padding: 8px 10px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
  font-size: 14px;
}

.editBtn:hover {
  background: #0284c7;
  color: white;
  transform: scale(1.1);
}

/* MODAL EDIT */
.editCard {
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.editCard input {
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

/* BOTONES */
.editActions {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.cancelBtn {
  flex: 1;
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 10px;
}

.cancelBtn:hover {
  background: #dc2626;
}
/* SECTION TITLE */
.sectionTitle {
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 15px;
  color: #0f172a;
}

/* CARD PRO */
.matchCardPro {
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border-radius: 18px;
  padding: 16px;
  margin-bottom: 14px;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  transition: all 0.25s ease;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.04);
}

.matchCardPro:hover {
  transform: translateY(-5px) scale(1.01);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
}

/* TOP */
.matchTop {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
  margin-bottom: 10px;
}

/* TEAMS */
.matchTeams {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin: 10px 0;
}

.teamName {
  flex: 1;
  text-align: center;
  font-size: 15px;
  font-weight: 700;
  color: #0f172a;
}

/* VS BADGE */
.vsBadge {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  font-size: 12px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: 999px;
  box-shadow: 0 4px 10px rgba(34, 197, 94, 0.3);
}

/* BOTTOM */
.matchBottom {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  font-size: 12px;
  color: #475569;
}

.stadium {
  background: #f1f5f9;
  padding: 6px 10px;
  border-radius: 8px;
}

/* 📱 RESPONSIVE */
@media (max-width: 600px) {
  .teamName {
    font-size: 13px;
  }

  .vsBadge {
    font-size: 10px;
    padding: 5px 8px;
  }

  .matchCardPro {
    padding: 14px;
  }
}
/* BOTÓN CERRAR MODAL PRO */
.closeBtn {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}

.closeBtn:hover {
  background: #ef4444;
  color: white;
  transform: rotate(90deg) scale(1.1);
}

.closeBtn:active {
  transform: scale(0.9);
}

/* GENERAL */
.referee {
  background: linear-gradient(180deg, #f1f5f9, #e2e8f0);
  padding: 25px;
  font-family: "Inter", sans-serif;
  min-height: 100vh;
}

/* PROFILE */
.profile {
  display: flex;
  align-items: center;
  gap: 18px;
  background: white;
  padding: 18px;
  border-radius: 18px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  margin-bottom: 25px;
  flex-wrap: wrap;
}

.avatar {
  width: 75px;
  height: 75px;
  border-radius: 50%;
  border: 3px solid #22c55e;
}

.info h1 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.info p {
  margin: 2px 0 0;
  font-size: 13px;
  color: #64748b;
}

.badge {
  margin-left: auto;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

/* MATCH */
.matchCard {
  background: white;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 12px;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.matchCard:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
}

.matches h2 {
  margin-bottom: 12px;
  font-size: 16px;
  font-weight: 600;
  color: #0f172a;
}

.teams {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
  font-size: 15px;
  margin-bottom: 8px;
}

.teams b {
  color: #22c55e;
  font-size: 13px;
}

/* META */
.meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 12px;
  color: #64748b;
}

.meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

/* MODAL */
.modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(6px);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* MODAL CARD */
.modalCard {
  background: white;
  width: 95%;
  max-width: 1100px;
  border-radius: 16px;
  padding: 15px;
  max-height: 90vh;
  overflow-y: auto;
}

/* HEADER */
.matchHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.matchHeader h2 {
  font-size: 18px;
  margin: 0;
}

/* SCORE */
.scoreboard {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, #22c55e, #16a34a);
  color: white;
  padding: 15px;
  border-radius: 12px;
  margin-top: 10px;
}

.score {
  font-size: 36px;
  font-weight: bold;
}

.minute {
  text-align: center;
  margin: 8px 0;
  font-size: 14px;
  color: #64748b;
}

/* GRID */
.teamsGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

/* TEAM CARD */
.teamCard {
  background: white;
  border-radius: 14px;
  padding: 12px;
  border: 1px solid #e2e8f0;
}

/* HEADER TEAM */
.teamHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.teamHeader h3 {
  font-size: 14px;
  margin: 0;
}

.teamStats {
  font-size: 11px;
  color: #64748b;
}

/* PLAYERS */
.playersList {
  display: flex;
  flex-direction: column;
  gap: 6px;
  max-height: 280px;
  overflow-y: auto;
}

.playerRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  border-radius: 10px;
  background: #f8fafc;
  transition: 0.2s;
}

.playerRow:hover {
  background: #eef2f7;
  transform: scale(1.01);
}

.playerName {
  font-size: 13px;
  font-weight: 500;
}

/* BOTONES */
.actionsPro {
  display: flex;
  gap: 5px;
}

.btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 13px;
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
  transform: scale(1.15);
}

.btn.yellow {
  background: #fef9c3;
}
.btn.yellow:hover {
  background: #eab308;
  color: white;
  transform: scale(1.15);
}

.btn.red {
  background: #fee2e2;
}
.btn.red:hover {
  background: #ef4444;
  color: white;
  transform: scale(1.15);
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
  align-items: center;
}

.min {
  font-weight: bold;
}

/* DELETE */
.deleteBtn {
  margin-left: auto;
  border: none;
  background: #fee2e2;
  color: #b91c1c;
  border-radius: 6px;
  padding: 4px 6px;
  cursor: pointer;
  font-size: 12px;
}

.deleteBtn:hover {
  background: #ef4444;
  color: white;
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
  font-weight: 600;
  cursor: pointer;
}

.saveBtn:hover {
  background: #16a34a;
}

/* ========================= */
/* 📱 RESPONSIVE */
/* ========================= */

@media (max-width: 768px) {
  .teamsGrid,
  .timelineGrid {
    grid-template-columns: 1fr;
  }

  .profile {
    flex-direction: column;
    align-items: flex-start;
  }

  .badge {
    margin-left: 0;
  }
}

@media (max-width: 600px) {
  .modal {
    align-items: flex-end;
  }

  .modalCard {
    width: 100%;
    border-radius: 20px 20px 0 0;
    animation: slideUp 0.3s ease;
  }

  .matchHeader h2 {
    font-size: 14px;
  }

  .scoreboard {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .score {
    font-size: 28px;
  }

  .playerRow {
    padding: 6px;
  }

  .playerName {
    font-size: 12px;
  }

  .btn {
    width: 28px;
    height: 28px;
    font-size: 12px;
  }

  .event {
    font-size: 12px;
    flex-wrap: wrap;
  }

  .saveBtn {
    padding: 14px;
    font-size: 14px;
    border-radius: 12px;
  }
}

/* ANIMACIÓN */
@keyframes slideUp {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
</style>
