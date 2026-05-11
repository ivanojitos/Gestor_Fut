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
        :class="{ playedCard: m.Estado === 'Jugado' }"
        @click="m.Estado !== 'Jugado' && selectMatch(m)"
      >
        <!-- TOP -->
        <div class="matchTop">
          <span class="matchDate"> 📅 {{ m.date }} </span>

          <span class="matchTime"> ⏰ {{ m.time }} </span>
        </div>

        <!-- TEAMS -->
        <div class="matchTeams">
          <div
            class="teamName clickableTeam"
            @click.stop="goToTeam(m.Id_Equipo_local, m.position)"
          >
            {{ m.home }}
          </div>

          <!-- 🔥 SI YA SE JUGÓ -->
          <div v-if="m.Estado === 'Jugado'" class="scorePlayed">
            {{ m.Goles_Local }} - {{ m.Goles_Visitante }}
          </div>

          <!-- 🔥 SI NO -->
          <div v-else class="vsBadge">VS</div>

          <div
            class="teamName clickableTeam"
            @click.stop="goToTeam(m.Id_Equipo_visitante, m.positionAway)"
          >
            {{ m.away }}
          </div>
        </div>

        <!-- BOTTOM -->
        <div class="matchBottom">
          <span class="stadium"> 🏟 {{ m.stadium }} </span>
        </div>

        <div class="extraInfo">
          <span>🏆 {{ m.league }}</span>

          <span>⚽ {{ m.category }}</span>
        </div>

        <!-- ESTADO -->
        <div v-if="m.Estado === 'Jugado'" class="playedBadge">
          ✅ Partido Jugado
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

        <div class="scorersGrid">
          <!-- LOCAL -->
          <div class="scorersCard">
            <h3>⚽ Goleadores {{ selectedMatch.home }}</h3>

            <div v-for="s in scorersHome" :key="s.name" class="scorerItem">
              <span>{{ s.name }}</span>

              <b>x{{ s.goals }}</b>
            </div>

            <p v-if="!scorersHome.length" class="emptyScorer">Sin goles</p>
          </div>

          <!-- VISITANTE -->
          <div class="scorersCard">
            <h3>⚽ Goleadores {{ selectedMatch.away }}</h3>

            <div v-for="s in scorersAway" :key="s.name" class="scorerItem">
              <span>{{ s.name }}</span>

              <b>x{{ s.goals }}</b>
            </div>

            <p v-if="!scorersAway.length" class="emptyScorer">Sin goles</p>
          </div>
        </div>

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
                <div class="playerInfo">
                  <img :src="API + p.photo" class="playerAvatar" />

                  <span class="playerName">
                    {{ p.name }}
                  </span>
                </div>

                <div class="actionsPro">
                  <button class="btn goal" @click="addEvent('goal', p, 'home')">
                    ⚽
                  </button>
                  <button
                    class="btn yellow"
                    @click="addEvent('yellow', p, 'home')"
                  >
                    🟨
                  </button>
                  <button class="btn red" @click="addEvent('red', p, 'home')">
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
                :key="p.id"
                class="playerRow"
              >
                <div class="playerInfo">
                  <img :src="API + p.photo" class="playerAvatar" />

                  <span class="playerName">
                    {{ p.name }}
                  </span>
                </div>

                <div class="actionsPro">
                  <button class="btn goal" @click="addEvent('goal', p, 'away')">
                    ⚽
                  </button>
                  <button
                    class="btn yellow"
                    @click="addEvent('yellow', p, 'away')"
                  >
                    🟨
                  </button>
                  <button class="btn red" @click="addEvent('red', p, 'away')">
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
            <br />
            <div v-for="(e, i) in eventsHome" :key="i" class="eventCard">
              <div class="eventInfo">
                <span class="eventIcon">
                  {{ icon(e.type) }}
                </span>

                <span class="eventPlayer">
                  {{ e.playerName }}
                </span>
              </div>

              <button class="deleteBtn" @click="removeEvent(i, 'home')">
                ✖
              </button>
            </div>
          </div>

          <div class="timeline">
            <h3>✈ {{ selectedMatch.away }}</h3>
            <br />
            <div v-for="(e, i) in eventsAway" :key="i" class="eventCard">
              <span>{{ icon(e.type) }}</span>
              <span class="playerName">{{ e.playerName }}</span>

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

  <div v-if="modal.show" class="globalModal">
    <div class="globalModalCard" :class="modal.type">
      <h3>{{ modal.title }}</h3>
      <p>{{ modal.message }}</p>

      <button @click="modal.show = false">OK</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

const API =
  "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";
  // "http://192.168.11.28:8080";
// "http://192.168.100.228:8080";

window.API = API;
const router = useRouter();
const route = useRoute();
const position = route.query.position;

defineExpose({
  API,
});

const modal = ref({
  show: false,
  title: "",
  message: "",
  type: "success", // success | error | info
});

const openModal = ({ title, message, type = "success" }) => {
  modal.value = {
    show: true,
    title,
    message,
    type,
  };
};




const goToTeam = (id, position) => {
  router.push({
    path: `/dashboard/equipo/${id}`,
    query: {
      position,
    },
  });
};

const referee = ref({
  Nombre: "",
  Edad: "",
  Estudios: "",
  Direccion: "",
  Celular: "",
  Correo: "",
  photo: "https://i.pravatar.cc/120?img=12",
});

const matches = ref([]);

const selectedMatch = ref(null);

const minute = ref(0);

const stats = ref({
  home: {
    goals: 0,
    yellow: 0,
    red: 0,
  },

  away: {
    goals: 0,
    yellow: 0,
    red: 0,
  },
});

/* =========================================================
   FORMATEAR FECHA
========================================================= */

const formatDate = (date) => {
  if (!date) return "Sin fecha";

  const [year, month, day] = date.split("T")[0].split("-");

  return `${day}/${month}/${year}`;
};

/* =========================================================
   FORMATEAR HORA
========================================================= */

const formatTime = (time) => {
  if (!time) return "";

  const [hour, minute] = time.split(":");

  const date = new Date();

  date.setHours(hour);
  date.setMinutes(minute);

  return date.toLocaleTimeString("es-MX", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

/* =========================================================
   CARGAR PARTIDOS
========================================================= */

const fetchMatches = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await axios.get(`${API}/api/partidos/arbitro/${user.Id}`);

    matches.value = res.data.data.map((m) => ({
      id: m.Id,

      Estado: m.Estado,

      Goles_Local: m.Goles_Local,
      Goles_Visitante: m.Goles_Visitante,

      Id_Equipo_local: m.Id_Equipo_local,
      Id_Equipo_visitante: m.Id_Equipo_visitante,

      // 🔥 POSICIONES
      position: m.Posicion_Local,
      positionAway: m.Posicion_Visitante,

      home: m.local,
      away: m.visitante,

      league: m.Liga,
      category: m.Categoria,

      date: formatDate(m.Fecha_Juego),
      time: formatTime(m.Hora_Juego),

      stadium: m.Cancha || "Sin cancha",

      referee: m.Arbitro,

      events: [],

      playersHome: [],
      playersAway: [],
    }));


    
  } catch (error) {
    openModal({
      title: "Ups",
      message: "Error cargando partidos",
      type: "warning",
    });
  }
};

/* =========================================================
   SELECCIONAR PARTIDO
========================================================= */

const selectMatch = async (m) => {
  try {
    minute.value = 0;

    stats.value = {
      home: {
        goals: 0,
        yellow: 0,
        red: 0,
      },

      away: {
        goals: 0,
        yellow: 0,
        red: 0,
      },
    };

    const [homePlayers, awayPlayers] = await Promise.all([
      axios.get(`${API}/api/equipos/${m.Id_Equipo_local}/jugadores`),

      axios.get(`${API}/api/equipos/${m.Id_Equipo_visitante}/jugadores`),
    ]);

    m.playersHome = homePlayers.data.data.map((j) => ({
      id: j.Id,
      name: j.NombreCompleto,
      photo: j.Foto,
    }));

    m.playersAway = awayPlayers.data.data.map((j) => ({
      id: j.Id,
      name: j.NombreCompleto,
      photo: j.Foto,
    }));

    selectedMatch.value = m;
  } catch (error) {
    openModal({
      title: "Ups",
      message: "Error cargando jugadores",
      type: "warning",
    });
  }
};

/* =========================================================
   ICONOS
========================================================= */

const icon = (type) => {
  if (type === "goal") return "⚽";

  if (type === "yellow") return "🟨";

  return "🟥";
};

/* =========================================================
   AGREGAR EVENTO
========================================================= */

const addEvent = (type, player, team) => {
  selectedMatch.value.events.push({
    minute: minute.value,

    type,

    playerId: player.id,
    playerName: player.name,
    playerPhoto: player.photo,

    team,
  });

  recalcStats();
};

/* =========================================================
   ESTADÍSTICAS
========================================================= */

const recalcStats = () => {
  const s = {
    home: {
      goals: 0,
      yellow: 0,
      red: 0,
    },

    away: {
      goals: 0,
      yellow: 0,
      red: 0,
    },
  };

  selectedMatch.value.events.forEach((e) => {
    if (e.type === "goal") {
      s[e.team].goals++;
    }

    if (e.type === "yellow") {
      s[e.team].yellow++;
    }

    if (e.type === "red") {
      s[e.team].red++;
    }
  });

  stats.value = s;
};

/* =========================================================
   TIMELINES
========================================================= */

const eventsHome = computed(() => {
  return selectedMatch.value?.events.filter((e) => e.team === "home") || [];
});

const eventsAway = computed(() => {
  return selectedMatch.value?.events.filter((e) => e.team === "away") || [];
});

/* =========================================================
   GOLEADORES LOCAL
========================================================= */

const scorersHome = computed(() => {
  const goals =
    selectedMatch.value?.events.filter(
      (e) => e.team === "home" && e.type === "goal",
    ) || [];

  const grouped = {};

  goals.forEach((g) => {
    if (!grouped[g.playerId]) {
      grouped[g.playerId] = {
        id: g.playerId,
        name: g.playerName,
        photo: g.playerPhoto,
        goals: 0,
      };
    }

    grouped[g.playerId].goals++;
  });

  return Object.values(grouped);
});

/* =========================================================
   GOLEADORES VISITANTE
========================================================= */

const scorersAway = computed(() => {
  const goals =
    selectedMatch.value?.events.filter(
      (e) => e.team === "away" && e.type === "goal",
    ) || [];

  const grouped = {};

  goals.forEach((g) => {
    if (!grouped[g.playerId]) {
      grouped[g.playerId] = {
        id: g.playerId,
        name: g.playerName,
        photo: g.playerPhoto,
        goals: 0,
      };
    }

    grouped[g.playerId].goals++;
  });

  return Object.values(grouped);
});

/* =========================================================
   ELIMINAR EVENTO
========================================================= */

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

/* =========================================================
   RELOJ
========================================================= */

setInterval(() => {
  if (selectedMatch.value) {
    minute.value++;
  }
}, 60000);

/* =========================================================
   GUARDAR PARTIDO
========================================================= */

const saveMatch = async () => {
  try {
    // 🔥 PAYLOAD COMPLETO
    const payload = {
      partido: {
        id: selectedMatch.value.id,

        fecha: selectedMatch.value.date,
        hora: selectedMatch.value.time,

        liga: selectedMatch.value.league,
        categoria: selectedMatch.value.category,

        estadio: selectedMatch.value.stadium,

        arbitro: referee.value.Nombre,
      },

      marcador: {
        local: stats.value.home.goals,
        visitante: stats.value.away.goals,
      },

      equipoLocal: {
        id: selectedMatch.value.Id_Equipo_local,

        nombre: selectedMatch.value.home,

        estadisticas: {
          goles: stats.value.home.goals,
          amarillas: stats.value.home.yellow,
          rojas: stats.value.home.red,
        },

        goleadores: scorersHome.value,

        eventos: eventsHome.value.map((e) => ({
          minuto: e.minute,

          tipo: e.type,

          jugador: {
            id: e.playerId,
            nombre: e.playerName,
            foto: e.playerPhoto,
          },
        })),
      },

      equipoVisitante: {
        id: selectedMatch.value.Id_Equipo_visitante,

        nombre: selectedMatch.value.away,

        estadisticas: {
          goles: stats.value.away.goals,
          amarillas: stats.value.away.yellow,
          rojas: stats.value.away.red,
        },

        goleadores: scorersAway.value,

        eventos: eventsAway.value.map((e) => ({
          minuto: e.minute,

          tipo: e.type,

          jugador: {
            id: e.playerId,
            nombre: e.playerName,
            foto: e.playerPhoto,
          },
        })),
      },

      timeline: selectedMatch.value.events,
    };

    // =====================================================
    // 🔥 ENVIAR AL BACKEND
    // =====================================================

    const response = await axios.post(`${API}/api/partidos/finalizar`, payload);

    if (response.data.ok) {
      openModal({
        title: "Listo",
        message: "✅ Partido finalizado correctamente",
        type: "success",
      });

      // cerrar modal
      selectedMatch.value = null;

      // refrescar partidos
      await fetchMatches();
    } else {
      openModal({
        title: "Ups",
        message: "❌ Ocurrió un error",
        type: "warning",
      });
    }
  } catch (error) {
    openModal({
      title: "Ups",
      message: "❌ Error enviando partido",
      type: "warning",
    });
  }
};

/* =========================================================
   EDITAR PERFIL
========================================================= */

const showEdit = ref(false);

const editForm = ref({
  Nombre: "",
  Edad: "",
  Estudios: "",
  Direccion: "",
  Celular: "",
  Correo: "",
});

const openEdit = () => {
  editForm.value = {
    ...referee.value,
  };

  showEdit.value = true;
};

const saveProfile = async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const id = user.Id || user.id;

    const response = await axios.put(
      `${API}/api/arbitro/${id}`,
      editForm.value,
    );

    if (response.data.ok) {
      referee.value = response.data.data;

      openModal({
        title: "Listo",
        message: "Datos actualizados correctamente",
        type: "success",
      });

      showEdit.value = false;
    }
  } catch (error) {
    console.error(error);

    openModal({
      title: "Ups",
      message: "❌ Error al actualizar",
      type: "warning",
    });
  }
};

/* =========================================================
   ON MOUNTED
========================================================= */

onMounted(async () => {
  try {
    const user = JSON.parse(localStorage.getItem("user"));

    const res = await axios.get(`${API}/api/arbitro/${user.Id}`);

    referee.value = res.data;

    await fetchMatches();
  } catch (error) {
    openModal({
      title: "Ups",
      message: "Error cargando árbitro",
      type: "warning",
    });
  }
});
</script>

<style scoped>
.clickableTeam {
  cursor: pointer;
  transition: 0.2s;
}

.clickableTeam:hover {
  color: #22c55e;
  transform: scale(1.03);
}
.globalModal {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(6px);
  z-index: 9999;
}

.globalModalCard {
  width: 320px;
  background: white;
  border-radius: 16px;
  padding: 18px;
  text-align: center;
  animation: pop 0.25s ease;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.2);
}

.globalModalCard.success {
  border-top: 5px solid #22c55e;
}

.globalModalCard.error {
  border-top: 5px solid #ef4444;
}

.globalModalCard.info {
  border-top: 5px solid #3b82f6;
}

.globalModalCard button {
  margin-top: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: #0f172a;
  color: white;
  cursor: pointer;
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
/* =========================================
🔥 MARCADOR PARTIDO JUGADO
========================================= */

.scorePlayed {
  background: #334155;

  color: white;

  padding: 8px 14px;

  border-radius: 999px;

  font-weight: bold;

  font-size: 14px;

  min-width: 70px;

  text-align: center;
}

/* =========================================
🔥 PARTIDO YA JUGADO
========================================= */

.playedCard {
  background: #d1d5db !important;
  opacity: 0.75;
  cursor: not-allowed;
  filter: grayscale(0.4);
}

.playedCard:hover {
  transform: none !important;
  box-shadow: none !important;
}

.playedBadge {
  margin-top: 12px;

  background: #475569;

  color: white;

  text-align: center;

  padding: 8px;

  border-radius: 10px;

  font-size: 12px;

  font-weight: bold;
}

.scorersGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;

  margin: 14px 0;
}

.scorersCard {
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.scorersCard h3 {
  margin-bottom: 10px;
  font-size: 14px;
}

.scorerItem {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 8px;
  margin-bottom: 6px;

  background: white;
  border-radius: 8px;
}

.emptyScorer {
  color: #64748b;
  font-size: 13px;
}

@media (max-width: 768px) {
  .scorersGrid {
    grid-template-columns: 1fr;
  }
}
.eventCard {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px;
  margin-bottom: 8px;

  background: white;
  border-radius: 10px;

  border: 1px solid #e2e8f0;
}

.eventInfo {
  display: flex;
  align-items: center;
  gap: 10px;

  flex-wrap: wrap;
}

.eventMinute {
  font-weight: bold;
  color: #0f172a;
  min-width: 35px;
}

.eventIcon {
  font-size: 18px;
}

.eventPlayer {
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

/* MOBILE */
@media (max-width: 600px) {
  .eventCard {
    padding: 8px;
  }

  .eventPlayer {
    font-size: 12px;
  }

  .eventIcon {
    font-size: 15px;
  }
}
.playerInfo {
  display: flex;
  align-items: center;
  gap: 10px;
}

.playerAvatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #22c55e;
}
.extraInfo {
  margin-top: 10px;
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  font-size: 13px;
  color: #475569;
  font-weight: 600;
}
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

/* =========================================================
   RESPONSIVE PRO TOTAL
========================================================= */

/* ---------- DESKTOP GRANDE ---------- */
.referee {
  width: 100%;
  max-width: 1600px;
  margin: auto;
}

/* GRID AUTOMÁTICO */
.teamsGrid,
.timelineGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

/* MODAL RESPONSIVE */
.modalCard {
  width: 95%;
  max-width: 1200px;
  max-height: 92vh;
  overflow-y: auto;
  border-radius: 20px;
}

/* PLAYERS */
.playersList {
  max-height: 320px;
  overflow-y: auto;
}

/* =========================================================
   TABLET
========================================================= */
@media (max-width: 1024px) {
  .referee {
    padding: 18px;
  }

  .profile {
    gap: 14px;
    padding: 16px;
  }

  .avatar {
    width: 65px;
    height: 65px;
  }

  .info h1 {
    font-size: 18px;
  }

  .teamsGrid,
  .timelineGrid {
    grid-template-columns: 1fr;
  }

  .modalCard {
    width: 96%;
    padding: 14px;
  }

  .score {
    font-size: 30px;
  }

  .teamName {
    font-size: 14px;
  }

  .playerName {
    font-size: 12px;
  }

  .btn {
    width: 30px;
    height: 30px;
  }

  .matchCardPro {
    padding: 14px;
  }
}

/* =========================================================
   CELULAR
========================================================= */
@media (max-width: 768px) {
  .referee {
    padding: 12px;
  }

  /* PERFIL */
  .profile {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
  }

  .badge {
    margin-left: 0;
  }

  .editBtn {
    margin-left: 0;
  }

  .avatar {
    width: 75px;
    height: 75px;
  }

  .info h1 {
    font-size: 18px;
  }

  .info p {
    font-size: 12px;
  }

  /* MATCH CARD */
  .matchCardPro {
    padding: 14px;
    border-radius: 16px;
  }

  .matchTop {
    flex-direction: column;
    gap: 4px;
    align-items: center;
    text-align: center;
  }

  .matchTeams {
    flex-direction: column;
    gap: 10px;
  }

  .teamName {
    font-size: 15px;
  }

  .vsBadge {
    font-size: 11px;
  }

  .matchBottom {
    margin-top: 12px;
  }

  .extraInfo {
    justify-content: center;
    text-align: center;
    font-size: 12px;
  }

  /* MODAL */
  .modal {
    align-items: flex-end;
  }

  .modalCard {
    width: 100%;
    height: 95vh;
    max-height: 95vh;
    border-radius: 22px 22px 0 0;
    padding: 14px;
    animation: slideUp 0.25s ease;
  }

  .matchHeader {
    align-items: center;
  }

  .matchHeader h2 {
    font-size: 15px;
    line-height: 1.4;
  }

  /* SCOREBOARD */
  .scoreboard {
    flex-direction: column;
    gap: 10px;
    text-align: center;
    padding: 14px;
  }

  .score {
    font-size: 30px;
  }

  .minute {
    font-size: 13px;
  }

  /* GRID */
  .teamsGrid,
  .timelineGrid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  /* TEAM CARD */
  .teamCard {
    padding: 10px;
  }

  .teamHeader {
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
  }

  .teamHeader h3 {
    font-size: 14px;
  }

  .teamStats {
    font-size: 11px;
  }

  /* PLAYERS */
  .playersList {
    max-height: 240px;
  }

  .playerRow {
    padding: 8px;
    gap: 8px;
  }

  .playerName {
    font-size: 12px;
  }

  .actionsPro {
    gap: 4px;
  }

  .btn {
    width: 28px;
    height: 28px;
    font-size: 11px;
  }

  /* TIMELINE */
  .timeline {
    padding: 10px;
  }

  .event {
    font-size: 12px;
    flex-wrap: wrap;
    gap: 6px;
  }

  .deleteBtn {
    margin-left: auto;
  }

  /* BOTONES */
  .saveBtn,
  .cancelBtn {
    padding: 14px;
    font-size: 14px;
  }

  /* EDIT */
  .editCard {
    width: 100%;
  }

  .editCard input {
    font-size: 14px;
  }
}

/* =========================================================
   CELULAR PEQUEÑO
========================================================= */
@media (max-width: 480px) {
  .referee {
    padding: 8px;
  }

  .profile {
    padding: 14px;
  }

  .sectionTitle {
    font-size: 16px;
  }

  .matchCardPro {
    padding: 12px;
  }

  .teamName {
    font-size: 14px;
  }

  .score {
    font-size: 26px;
  }

  .playerName {
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .btn {
    width: 26px;
    height: 26px;
  }

  .modalCard {
    padding: 12px;
  }
}

/* =========================================================
   ANIMACIÓN MOBILE
========================================================= */
@keyframes slideUp {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}
</style>
