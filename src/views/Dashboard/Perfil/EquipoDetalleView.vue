<template>
  <div class="club">
    <!-- TOP HEADER -->
    <header class="header">
      <div class="teamInfo">
        <img :src="team.logo" class="logo" />

        <div>
          <h1>{{ team.name }}</h1>
          <p class="sub">{{ team.liga }} • {{ team.categoria }}</p>

          <div class="stats">
            <span>🏆 {{ team.wins }}</span>
            <span>❌ {{ team.losses }}</span>
            <span>📊 #{{ team.position }}</span>
          </div>
        </div>
      </div>

      <button class="modeBtn" @click="goToGameMode">🎮 MODO JUEGO</button>
    </header>

    <!-- HIGHLIGHTS -->
    <section class="highlights">
      <div class="card">⚽ {{ best.st.name }}</div>
      <div class="card">🛡️ {{ best.def.name }}</div>
      <div class="card">🎯 {{ best.mid.name }}</div>
      <div class="card">🧤 {{ best.gk.name }}</div>
    </section>

    <!-- MAIN LAYOUT -->
    <section class="layout">
      <!-- LEFT: PLAYERS -->
      <div class="panel">
        <h2>👥 Plantilla ({{ players.length }})</h2>

        <div class="players">
          <div v-for="p in players" :key="p.number" class="playerCard">
            <img :src="p.photo" />

            <div class="info">
              <b>#{{ p.number }} {{ p.name }}</b>
              <small>{{ p.position }}</small>
            </div>

            <div class="stats">⚽ {{ p.goals }} | 🎯 {{ p.assists }}</div>
          </div>
        </div>
      </div>

      <!-- RIGHT: MATCHES -->
      <div class="panel">
        <h2>📅 Partidos</h2>

        <!-- NEXT MATCH -->
        <div class="match next">
          <h3>🔜 Próximo partido</h3>
          <p>
            <b>{{ matches?.next?.home }}</b> vs <b>{{ matches.next.away }}</b>
          </p>
          <small>🏟 {{ matches.next.stadium }}</small>
        </div>

        <!-- LAST MATCHES -->
        <div class="match" v-for="m in matches.last" :key="m.id">
          <h3>{{ m.home }} {{ m.score }} {{ m.away }}</h3>

          <div class="meta">
            <small>🏟 {{ m.stadium }}</small>
            <small>🧑‍⚖️ {{ m.ref }}</small>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const matches = ref({
  next: {
    home: "",
    away: "",
    stadium: "",
  },
  last: [],
});

const API =
  "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";

const router = useRouter();

const storedUser = JSON.parse(localStorage.getItem("user"));

const team = ref({
  id: null,
  name: "",
  logo: "",
  liga: "",
  categoria: "",
  wins: 0,
  losses: 0,
  position: 0,
});

const players = ref([]);

const goToGameMode = () => {
  router.push({ name: "ModoJuego", params: { id: team.value.id } });
};

const fetchData = async () => {
  try {
    if (!storedUser) return;

    // 🔥 EQUIPO
    const resEquipo = await axios.get(
      `${API}/api/equipos/jugador/${storedUser.Id}`,
    );

    const equipoData = resEquipo.data.data;

    // 🔴 VALIDACIÓN IMPORTANTE
    if (!equipoData || equipoData.length === 0) {
      console.warn("No tienes equipo");
      return;
    }

    const equipo = equipoData[0]; // ✅ ahora sí correcto

    // 🔥 SET TEAM
    team.value = {
      id: equipo.Id,
      name: equipo.Nombre,
      logo: equipo.Logo || "https://via.placeholder.com/120",
      liga: equipo.Liga || "Sin liga",
      categoria: equipo.Categoria || "Sin categoría",
      wins: equipo.PG || 0,
      losses: equipo.PP || 0,
      position: 1,
    };

    // 🔴 VALIDAR ID
    if (!equipo.Id) return;

    // 🔥 JUGADORES
    const resJugadores = await axios.get(
      `${API}/api/equipos/${equipo.Id}/jugadores`,
    );

    players.value = resJugadores.data.data.map((p) => ({
      name: p.NombreCompleto,
      position: p.Posicion,
      number: p.Numero,
      goals: p.Goles || 0,
      assists: p.Asistencias || 0,
      photo:
        p.Foto ||
        `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}`,
    }));
  } catch (err) {
    console.error("ERROR:", err);
  }
};

onMounted(fetchData);

// 🔥 BEST PLAYERS
const best = computed(() => ({
  gk: players.value.find((p) => p.position === "GK") || {},
  def:
    [...players.value]
      .filter((p) => p.position === "DEF")
      .sort((a, b) => b.goals + b.assists - (a.goals + a.assists))[0] || {},
  mid:
    [...players.value]
      .filter((p) => p.position === "MID")
      .sort((a, b) => b.goals + b.assists - (a.goals + a.assists))[0] || {},
  st:
    [...players.value]
      .filter((p) => p.position === "ST")
      .sort((a, b) => b.goals - a.goals)[0] || {},
}));
</script>

<style scoped>
.club {
  font-family: "Segoe UI";
  background: #f3f4f6;
  color: #111;
  padding: 16px;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #b4a518;
  padding: 14px;
  color: white;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
}

.teamInfo {
  display: flex;
  gap: 12px;
  align-items: center;
}

.logo {
  width: 60px;
  border-radius: 50%;
}

.sub {
  font-size: 12px;
  color: #666;
}

.stats span {
  margin-right: 10px;
  font-weight: 600;
}

/* BUTTON */
.modeBtn {
  background: linear-gradient(135deg, #0b37ff, #b5b5be);
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 999px;
  cursor: pointer;
}

/* HIGHLIGHTS */
.highlights {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin-top: 15px;
}

.card {
  background: linear-gradient(135deg, #04eb17, #251d1d);
  padding: 12px;
  color: white;
  border-radius: 14px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  text-align: center;
  font-weight: 600;
}

/* LAYOUT */
.layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 15px;
  margin-top: 15px;
}

/* PANELS */
.panel {
  background: white;
  border-radius: 14px;
  padding: 14px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

/* PLAYERS */
.players {
  display: grid;
  gap: 10px;
}

.playerCard {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px;
  border-radius: 12px;
}

.playerCard img {
  width: 40px;
  border-radius: 50%;
}

.info {
  flex: 1;
  margin-left: 10px;
}

/* MATCHES */
.match {
  background: #cfd4d8;
  padding: 10px;
  border-radius: 12px;
  margin-bottom: 10px;
}

.next {
  border-left: 5px solid #22c55e;
  background-color: #07af39;
  color: white;
}

.meta {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 12px;
  color: #666;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .highlights {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
