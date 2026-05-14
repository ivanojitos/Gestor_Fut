<template>
  <div class="referee">
    <!-- PERFIL -->
    <section class="profile">
      <!-- <img :src="referee.photo" class="avatar" /> -->

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
          <span class="stadium"> Cancha {{ m.stadium }} </span>
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
    <div class="modalCard editProfileModal">
      <!-- HEADER -->
      <div class="editHeader">
        <div>
          <h2>⚙️ Editar Perfil</h2>
          <p>Actualiza la información del árbitro</p>
        </div>

        <button class="closeEdit" @click="showEdit = false">✕</button>
      </div>

      <!-- AVATAR -->
      <div class="profilePreview">
        <div class="avatarPreview">
          {{ editForm.Nombre?.charAt(0) || "A" }}
        </div>

        <div>
          <h3>{{ editForm.Nombre || "Árbitro" }}</h3>
          <span>Perfil profesional</span>
        </div>
      </div>

      <!-- FORM -->
      <div class="formGrid">
        <div class="inputGroup">
          <label>Nombre completo</label>
          <input v-model="editForm.Nombre" type="text" />
        </div>

        <div class="inputGroup">
          <label>Edad</label>
          <input v-model="editForm.Edad" type="number" />
        </div>

        <div class="inputGroup full">
          <label>Estudios</label>
          <input v-model="editForm.Estudios" type="text" />
        </div>

        <div class="inputGroup full">
          <label>Dirección</label>
          <input v-model="editForm.Direccion" type="text" />
        </div>

        <div class="inputGroup">
          <label>Celular</label>
          <input v-model="editForm.Celular" type="text" />
        </div>

        <div class="inputGroup">
          <label>Correo</label>
          <input v-model="editForm.Correo" type="email" />
        </div>
      </div>

      <!-- ACTIONS -->
      <div class="editActions">
        <button class="cancelBtn" @click="showEdit = false">Cancelar</button>

        <button class="saveProfileBtn" @click="saveProfile">
          💾 Guardar cambios
        </button>
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

    console.log(res.data.data);

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

      stadium: m.Id_Cancha || "Sin cancha",

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
/* =========================================================
BASE
========================================================= */

* {
  box-sizing: border-box;
}

.referee {
  min-height: 100vh;
  padding: 24px;
  background:
    radial-gradient(
      circle at top left,
      rgba(34, 197, 94, 0.08),
      transparent 30%
    ),
    radial-gradient(
      circle at bottom right,
      rgba(59, 130, 246, 0.08),
      transparent 30%
    ),
    linear-gradient(180deg, #f1f5f9, #e2e8f0);

  font-family: "Inter", sans-serif;
  color: #0f172a;
}

/* =========================================================
PROFILE
========================================================= */

.profile {
  position: relative;

  display: flex;
  align-items: center;
  gap: 20px;

  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(14px);

  border: 1px solid rgba(255, 255, 255, 0.6);

  border-radius: 28px;

  padding: 24px;

  box-shadow:
    0 10px 30px rgba(15, 23, 42, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);

  margin-bottom: 30px;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;

  border: 4px solid #22c55e;

  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.25);
}

.info h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.5px;
}

.info p {
  margin-top: 6px;
  color: #64748b;
  font-size: 14px;
}

.badge {
  margin-left: auto;

  background: linear-gradient(135deg, #22c55e, #16a34a);

  color: white;

  padding: 10px 18px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;

  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.25);
}

.editBtn {
  width: 44px;
  height: 44px;

  border-radius: 14px;
  border: none;

  background: white;

  cursor: pointer;

  font-size: 16px;

  transition: 0.25s ease;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
}

.editBtn:hover {
  transform: translateY(-3px) rotate(8deg);
  background: #0f172a;
  color: white;
}

/* =========================================================
SECTION TITLE
========================================================= */

.sectionTitle {
  font-size: 22px;
  font-weight: 800;

  margin-bottom: 20px;

  display: flex;
  align-items: center;
  gap: 10px;
}

/* =========================================================
MATCH CARD
========================================================= */

.matchCardPro {
  position: relative;

  overflow: hidden;

  background: rgba(255, 255, 255, 0.78);

  backdrop-filter: blur(10px);

  border: 1px solid rgba(255, 255, 255, 0.5);

  border-radius: 28px;

  padding: 22px;

  margin-bottom: 18px;

  transition: 0.35s ease;

  cursor: pointer;

  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
}

.matchCardPro::before {
  content: "";

  position: absolute;

  top: 0;
  left: 0;

  width: 100%;
  height: 5px;

  background: linear-gradient(90deg, #22c55e, #16a34a, #3b82f6);
}

.matchCardPro:hover {
  transform: translateY(-6px);

  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.12);
}

/* =========================================================
TOP INFO
========================================================= */

.matchTop {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 20px;

  color: #64748b;
  font-size: 13px;
  font-weight: 700;
}

/* =========================================================
TEAMS
========================================================= */

.matchTeams {
  display: grid;
  grid-template-columns: 1fr auto 1fr;

  align-items: center;

  gap: 15px;
}

.teamName {
  font-size: 20px;
  font-weight: 800;

  text-align: center;

  transition: 0.25s ease;
}

.clickableTeam:hover {
  color: #22c55e;
  transform: scale(1.04);
}

.vsBadge,
.scorePlayed {
  min-width: 85px;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 12px 18px;

  border-radius: 999px;

  font-size: 14px;
  font-weight: 900;

  letter-spacing: 1px;
}

.vsBadge {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;

  box-shadow: 0 10px 25px rgba(34, 197, 94, 0.3);
}

.scorePlayed {
  background: #0f172a;
  color: white;
}

/* =========================================================
BOTTOM
========================================================= */

.matchBottom {
  margin-top: 22px;

  display: flex;
  justify-content: center;
}

.stadium {
  background: #f8fafc;

  padding: 10px 14px;

  border-radius: 14px;

  font-size: 13px;
  font-weight: 700;

  border: 1px solid #e2e8f0;
}

.extraInfo {
  margin-top: 16px;

  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.extraInfo span {
  background: white;

  border: 1px solid #e2e8f0;

  padding: 8px 12px;

  border-radius: 999px;

  font-size: 12px;
  font-weight: 700;

  color: #475569;
}

/* =========================================================
PLAYED
========================================================= */

.playedCard {
  opacity: 0.82;
  filter: grayscale(0.25);
}

.playedBadge {
  margin-top: 16px;

  text-align: center;

  background: #0f172a;
  color: white;

  padding: 12px;

  border-radius: 14px;

  font-size: 12px;
  font-weight: 800;
}

/* =========================================================
MODAL
========================================================= */

.modal {
  position: fixed;
  inset: 0;

  z-index: 9999;

  background: rgba(15, 23, 42, 0.6);

  backdrop-filter: blur(10px);

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 20px;
}

.modalCard {
  width: 100%;
  max-width: 1200px;

  max-height: 92vh;

  overflow-y: auto;

  border-radius: 30px;

  padding: 24px;

  background: rgba(255, 255, 255, 0.95);

  backdrop-filter: blur(20px);

  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.2);

  animation: modalIn 0.35s ease;
}

/* =========================================================
MODAL HEADER
========================================================= */

.matchHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 20px;
}

.matchHeader h2 {
  font-size: 24px;
  font-weight: 800;
}

.closeBtn {
  width: 42px;
  height: 42px;

  border: none;
  border-radius: 14px;

  background: #fee2e2;

  cursor: pointer;

  transition: 0.25s ease;
}

.closeBtn:hover {
  background: #ef4444;
  color: white;

  transform: rotate(90deg);
}

/* =========================================================
SCOREBOARD
========================================================= */

.scoreboard {
  background: linear-gradient(135deg, #22c55e, #16a34a);

  color: white;

  border-radius: 24px;

  padding: 24px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 15px;

  box-shadow: 0 20px 40px rgba(34, 197, 94, 0.25);
}

.score {
  font-size: 58px;
  font-weight: 900;
}

.minute {
  text-align: center;

  font-size: 15px;
  font-weight: 700;

  color: #64748b;

  margin-bottom: 20px;
}

/* =========================================================
GRID
========================================================= */

.teamsGrid,
.timelineGrid,
.scorersGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;

  margin-top: 18px;
}

/* =========================================================
CARDS
========================================================= */

.teamCard,
.timeline,
.scorersCard {
  background: #ffffff;

  border-radius: 24px;

  padding: 18px;

  border: 1px solid #e2e8f0;

  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.04);
}

.teamHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 16px;
}

.teamHeader h3 {
  margin: 0;

  font-size: 16px;
  font-weight: 800;
}

.teamStats {
  font-size: 12px;
  color: #64748b;
}

/* =========================================================
PLAYERS
========================================================= */

.playersList {
  display: flex;
  flex-direction: column;
  gap: 10px;

  max-height: 320px;
  overflow-y: auto;
}

.playerRow {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px;

  border-radius: 16px;

  background: #f8fafc;

  transition: 0.25s ease;
}

.playerRow:hover {
  transform: scale(1.015);
  background: #eef2ff;
}

.playerInfo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.playerAvatar {
  width: 42px;
  height: 42px;

  border-radius: 50%;

  object-fit: cover;

  border: 3px solid #22c55e;
}

.playerName {
  font-size: 14px;
  font-weight: 700;
}

/* =========================================================
BUTTONS
========================================================= */

.actionsPro {
  display: flex;
  gap: 8px;
}

.btn {
  width: 36px;
  height: 36px;

  border: none;
  border-radius: 12px;

  cursor: pointer;

  transition: 0.2s ease;

  font-size: 14px;
}

.btn:hover {
  transform: scale(1.15);
}

.goal {
  background: #dcfce7;
}

.yellow {
  background: #fef9c3;
}

.red {
  background: #fee2e2;
}

/* =========================================================
EVENTS
========================================================= */

.eventCard {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 12px;

  margin-bottom: 10px;

  border-radius: 16px;

  background: #f8fafc;
}

.eventInfo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.eventIcon {
  font-size: 20px;
}

.eventPlayer {
  font-weight: 700;
}

.deleteBtn {
  border: none;

  background: #fee2e2;

  width: 30px;
  height: 30px;

  border-radius: 10px;

  cursor: pointer;

  transition: 0.2s ease;
}

.deleteBtn:hover {
  background: #ef4444;
  color: white;
}

/* =========================================================
SAVE BTN
========================================================= */

.saveBtn,
.cancelBtn {
  width: 100%;

  border: none;

  padding: 16px;

  border-radius: 16px;

  font-size: 15px;
  font-weight: 800;

  cursor: pointer;

  transition: 0.25s ease;
}

.saveBtn {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;

  box-shadow: 0 12px 25px rgba(34, 197, 94, 0.25);
}

.saveBtn:hover {
  transform: translateY(-2px);
}

.cancelBtn {
  background: #ef4444;
  color: white;
}

/* =========================================================
SCROLL
========================================================= */

::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 999px;
}

/* =========================================================
ANIMATIONS
========================================================= */

@keyframes modalIn {
  from {
    opacity: 0;
    transform: scale(0.94) translateY(20px);
  }

  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* =========================================================
TABLET
========================================================= */

@media (max-width: 1024px) {
  .teamName {
    font-size: 17px;
  }

  .score {
    font-size: 44px;
  }

  .teamsGrid,
  .timelineGrid,
  .scorersGrid {
    grid-template-columns: 1fr;
  }
}

/* =========================================================
MOBILE
========================================================= */

@media (max-width: 768px) {
  .referee {
    padding: 14px;
  }

  .profile {
    flex-direction: column;
    text-align: center;
    align-items: center;
  }

  .badge {
    margin-left: 0;
  }

  .matchTeams {
    grid-template-columns: 1fr;
  }

  .vsBadge,
  .scorePlayed {
    margin: auto;
  }

  .teamName {
    font-size: 16px;
  }

  .scoreboard {
    flex-direction: column;
    gap: 10px;

    text-align: center;
  }

  .score {
    font-size: 42px;
  }

  .matchHeader h2 {
    font-size: 18px;
  }

  .modal {
    align-items: flex-end;
    padding: 0;
  }

  .modalCard {
    border-radius: 28px 28px 0 0;

    max-height: 95vh;

    animation: slideUp 0.3s ease;
  }
}

/* =========================================================
SMALL MOBILE
========================================================= */

@media (max-width: 480px) {
  .profile {
    padding: 18px;
  }

  .matchCardPro {
    padding: 18px;
  }

  .playerName {
    max-width: 120px;

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .score {
    font-size: 36px;
  }

  .btn {
    width: 32px;
    height: 32px;
  }
}

/* =========================================================
SLIDE MOBILE
========================================================= */

@keyframes slideUp {
  from {
    transform: translateY(100%);
  }

  to {
    transform: translateY(0);
  }
}
/* =========================================================
EDIT PROFILE MODAL
========================================================= */

.editProfileModal {
  max-width: 720px;

  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.96),
    rgba(248, 250, 252, 0.96)
  );

  backdrop-filter: blur(20px);

  border-radius: 30px;

  padding: 28px;

  border: 1px solid rgba(255, 255, 255, 0.6);

  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.15);
}

/* HEADER */

.editHeader {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;

  margin-bottom: 25px;
}

.editHeader h2 {
  margin: 0;

  font-size: 28px;
  font-weight: 800;

  color: #0f172a;
}

.editHeader p {
  margin-top: 6px;

  color: #64748b;

  font-size: 14px;
}

.closeEdit {
  width: 42px;
  height: 42px;

  border: none;

  border-radius: 14px;

  background: #fee2e2;

  color: #ef4444;

  cursor: pointer;

  transition: 0.25s ease;

  font-size: 15px;
}

.closeEdit:hover {
  background: #ef4444;
  color: white;

  transform: rotate(90deg);
}

/* PROFILE PREVIEW */

.profilePreview {
  display: flex;
  align-items: center;
  gap: 16px;

  background: rgba(255, 255, 255, 0.7);

  border: 1px solid #e2e8f0;

  border-radius: 24px;

  padding: 18px;

  margin-bottom: 25px;
}

.avatarPreview {
  width: 72px;
  height: 72px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(135deg, #22c55e, #16a34a);

  color: white;

  font-size: 28px;
  font-weight: 800;

  box-shadow: 0 10px 30px rgba(34, 197, 94, 0.25);
}

.profilePreview h3 {
  margin: 0;

  font-size: 20px;
  font-weight: 800;
}

.profilePreview span {
  color: #64748b;
  font-size: 13px;
}

/* GRID */

.formGrid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

.inputGroup {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.inputGroup.full {
  grid-column: span 2;
}

/* LABEL */

.inputGroup label {
  font-size: 13px;
  font-weight: 700;
  color: #334155;
}

/* INPUT */

.inputGroup input {
  height: 54px;

  border-radius: 18px;

  border: 1px solid #dbe4ee;

  background: rgba(255, 255, 255, 0.85);

  padding: 0 16px;

  font-size: 14px;

  transition: 0.25s ease;

  outline: none;
}

.inputGroup input:focus {
  border-color: #22c55e;

  background: white;

  box-shadow: 0 0 0 5px rgba(34, 197, 94, 0.12);
}

/* ACTIONS */

.editActions {
  margin-top: 28px;

  display: flex;
  gap: 14px;
}

.saveProfileBtn {
  flex: 1;

  height: 56px;

  border: none;

  border-radius: 18px;

  background: linear-gradient(135deg, #22c55e, #16a34a);

  color: white;

  font-size: 15px;
  font-weight: 800;

  cursor: pointer;

  transition: 0.25s ease;

  box-shadow: 0 12px 30px rgba(34, 197, 94, 0.25);
}

.saveProfileBtn:hover {
  transform: translateY(-3px);

  box-shadow: 0 20px 40px rgba(34, 197, 94, 0.3);
}

.cancelBtn {
  width: 180px;

  height: 56px;

  border-radius: 18px;

  border: none;

  background: #ef4444;

  color: white;

  font-weight: 700;

  cursor: pointer;

  transition: 0.25s ease;
}

.cancelBtn:hover {
  transform: translateY(-2px);
}

/* =========================================================
TABLET
========================================================= */

@media (max-width: 768px) {
  .editProfileModal {
    padding: 22px;
  }

  .formGrid {
    grid-template-columns: 1fr;
  }

  .inputGroup.full {
    grid-column: span 1;
  }

  .editActions {
    flex-direction: column;
  }

  .cancelBtn {
    width: 100%;
  }
}

/* =========================================================
MOBILE
========================================================= */

@media (max-width: 480px) {
  .editProfileModal {
    border-radius: 28px 28px 0 0;

    padding: 18px;
  }

  .editHeader h2 {
    font-size: 22px;
  }

  .profilePreview {
    flex-direction: column;
    text-align: center;
  }

  .avatarPreview {
    width: 64px;
    height: 64px;

    font-size: 24px;
  }

  .inputGroup input {
    height: 50px;
  }
}
</style>
