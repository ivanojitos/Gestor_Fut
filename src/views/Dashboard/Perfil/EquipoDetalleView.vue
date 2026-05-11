<template>
  <div class="club">
    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg"></div>

      <div class="action-bar">
        <button @click="goToGameMode">🎮 MODO DT</button>
      </div>

      <div class="logo-wrapper">
        <img v-if="team.logo" :src="encodeURI(API + team.logo)" />
      </div>

      <h1>{{ team.name }}</h1>
      <p>{{ team.liga }} • {{ team.categoria }}</p>

      <div class="hero-stats">
        <div>
          <b>{{ team.wins }}</b>
          <span>Ganados</span>
        </div>

        <div>
          <b>{{ team.losses }}</b>
          <span>Perdidos</span>
        </div>

        <div>
          <b>#{{ team.position }}</b>
          <span>Posición</span>
        </div>
      </div>
    </section>

    <!-- CONTENT -->
    <section class="layout">
      <!-- PLAYERS -->
      <div class="panel">
        <h2>Plantilla</h2>

        <div class="players">
          <div v-for="p in players" :key="p.number" class="playerCard">
            <img v-if="p.photo" :src="encodeURI(API + p.photo)" />

            <div class="player-info">
              <b>#{{ p.number }} {{ p.name }}</b>
              <small>{{ p.position }}</small>
            </div>

            <div class="mini-stats">
              <div class="stat-pill goals">⚽ {{ p.goals }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- MATCHES -->
      <div class="panel">
        <h2>Partidos</h2>

        <!-- 🔥 PRÓXIMO PARTIDO -->
        <!-- PRÓXIMO PARTIDO -->
        <div v-if="nextMatch" class="match next">
          <p>
            <b>{{ nextMatch.home }}</b>
            vs
            <b>{{ nextMatch.away }}</b>
          </p>

          <small>
            {{ formatDateTime(nextMatch.date, nextMatch.time) }}
          </small>
        </div>

        <p v-else>No hay próximo partido</p>

        <!-- HISTORIAL -->
        <h3 style="margin-top: 20px">📅 Historial</h3>

        <div v-if="lastMatches.length">
          <div v-for="m in lastMatches" :key="m.id" class="match">
            {{ m.home }} vs {{ m.away }}

            <br />

            <small>
              {{ formatDateTime(m.date, m.time) }}
            </small>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

const API =
  "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";
  // "http://192.168.11.28:8080";
// "http://192.168.100.228:8080";

const router = useRouter();
const route = useRoute();
const idEquipo = route.params.id;
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
const matches = ref([]);
let position = route.query.position;

const goToGameMode = () => {
  router.push({
    name: "ModoJuego",
    params: { id: team.value.id },
  });
};

/* =========================
   PARTIDOS
========================= */
const fetchMatches = async () => {
  try {
    if (!team.value.id) return; // 🔥 IMPORTANTE

    const res = await axios.get(`${API}/api/partidos/equipo/${team.value.id}`, {
      params: {
        liga: team.value.liga || "",
        categoria: team.value.categoria || "",
      },
    });

    matches.value = res.data.data.map((m) => ({
      id: m.Id,
      home: m.local,
      away: m.visitante,
      date: m.Fecha_Juego,
      time: m.Hora_Juego,
      stadium: m.Cancha,
      referee: m.Arbitro,
      status: m.Estado,
    }));
  } catch (err) {
    console.error(err);
  }
};

const formatDateTime = (dateStr, timeStr) => {
  if (!dateStr) return "";

  // 🔥 separar fecha sin timezone
  const [year, month, day] = dateStr.split("T")[0].split("-");

  // 🔥 crear fecha LOCAL
  const date = new Date(year, month - 1, day);

  const days = [
    "Domingo",
    "Lunes",
    "Martes",
    "Miércoles",
    "Jueves",
    "Viernes",
    "Sábado",
  ];

  const dayName = days[date.getDay()];

  // 🔥 hora
  let [hours, minutes] = timeStr.split(":");

  hours = parseInt(hours);

  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12 || 12;

  return `${dayName} ${day}-${month}-${year} - ${hours}:${minutes} ${ampm}`;
};

/* 🔥 próximo partido */
const nextMatch = computed(() => {
  return matches.value.find((m) => m.status === "Programado") || null;
});

/* 🔥 historial */
const lastMatches = computed(() => {
  return matches.value.filter((m) => m.status === "jugado");
});

/* =========================
   EQUIPO + JUGADORES
========================= */
const fetchData = async () => {
  try {
    // 🔥 obtener todos los equipos
    const resEquipos = await axios.get(`${API}/api/equipos`);
    let equipo = null;

    //  si viene por params
    if (idEquipo) {
      equipo = resEquipos.data.data.find(
        (e) => Number(e.Id) === Number(idEquipo),
      );
    }

    //  fallback desde usuario
    if (!equipo && storedUser?.Id_Equipo) {
      equipo = resEquipos.data.data.find(
        (e) => Number(e.Id) === Number(storedUser.Id_Equipo),
      );
    }

    position = equipo.Posicion;


    if (!equipo) return;

    // 🔥 llenar info
    team.value = {
      id: equipo.Id,
      name: equipo.Nombre,
      logo: equipo.Logo?.replace(/\s+/g, "").trim(),
      liga: equipo.Liga || "Sin liga",
      categoria: equipo.Categoria || "Sin categoría",
      wins: equipo.PG || 0,
      losses: equipo.PP || 0,
      // 🔥 posición real desde tabla
      position: Number(position) || 0,
    };

    // 🔥 jugadores
    const resJugadores = await axios.get(
      `${API}/api/equipos/${equipo.Id}/jugadores`,
    );

    players.value = resJugadores.data.data.map((p) => ({
      name: p.NombreCompleto,
      position: p.Posicion,
      number: p.Numero,
      goals: p.Goles || 0,
      assists: p.Asistencias || 0,
      photo: p.Foto?.replace(/\s+/g, "").trim(),
    }));
  } catch (err) {
    console.error(err);
  }
};

onMounted(async () => {
  await fetchData();

  // 🔥 espera a que team exista
  if (team.value.id) {
    await fetchMatches();
  }
});
</script>

<style scoped>
.club {
  min-height: 100vh;
  padding: 24px;
  background: linear-gradient(180deg, #f8fafc 0%, #eef2ff 100%);
  font-family: "Inter", sans-serif;
  color: #0f172a;
}

/* HERO */
.hero {
  position: relative;
  overflow: hidden;

  border-radius: 34px;

  padding: 90px 40px 40px;

  background: linear-gradient(135deg, #ffffff, #f8fafc);

  box-shadow:
    0 25px 60px rgba(15, 23, 42, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);

  margin-bottom: 24px;
}

/* HERO BG */
.hero-bg {
  position: absolute;
  inset: 0;

  background:
    radial-gradient(circle at top right, #22c55e22, transparent 30%),
    radial-gradient(circle at bottom left, #3b82f622, transparent 35%);

  z-index: 0;
}

/* ACTION BAR */
.action-bar {
  position: absolute;

  top: 24px;
  right: 24px;

  z-index: 20;
}

/* BUTTON */
.action-bar button {
  border: none;

  background: linear-gradient(135deg, #22c55e, #16a34a);

  color: white;

  height: 52px;

  padding: 0 26px;

  border-radius: 16px;

  font-size: 14px;
  font-weight: 900;

  cursor: pointer;

  transition: 0.25s ease;

  box-shadow:
    0 12px 30px rgba(34, 197, 94, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
}

.action-bar button:hover {
  transform: translateY(-3px) scale(1.03);
}

/* LOGO */
.logo-wrapper {
  position: relative;
  z-index: 2;

  width: 170px;
  height: 170px;

  margin: auto;

  border-radius: 50%;

  padding: 10px;

  background: linear-gradient(135deg, #ffffff, #e2e8f0);

  box-shadow:
    0 20px 50px rgba(15, 23, 42, 0.15),
    inset 0 0 12px rgba(255, 255, 255, 0.8);

  transition: 0.3s ease;
}

.logo-wrapper:hover {
  transform: scale(1.04);
}

.logo-wrapper img {
  width: 100%;
  height: 100%;

  object-fit: cover;

  border-radius: 50%;
}

/* TITLES */
.hero h1 {
  position: relative;
  z-index: 2;

  margin-top: 24px;

  text-align: center;

  font-size: 38px;
  font-weight: 900;

  color: #0f172a;
}

.hero p {
  position: relative;
  z-index: 2;

  margin-top: 8px;

  text-align: center;

  font-size: 15px;
  font-weight: 600;

  color: #64748b;
}

/* STATS */
.hero-stats {
  position: relative;
  z-index: 2;

  margin-top: 34px;

  display: grid;
  grid-template-columns: repeat(3, 1fr);

  gap: 18px;
}

.hero-stats div {
  background: rgba(255, 255, 255, 0.8);

  border: 1px solid rgba(226, 232, 240, 0.8);

  border-radius: 22px;

  padding: 24px 18px;

  text-align: center;

  backdrop-filter: blur(10px);

  transition: 0.25s ease;
}

.hero-stats div:hover {
  transform: translateY(-4px);

  box-shadow: 0 12px 25px rgba(15, 23, 42, 0.08);
}

.hero-stats b {
  display: block;

  font-size: 34px;
  font-weight: 900;

  color: #16a34a;
}

.hero-stats span {
  margin-top: 6px;

  display: block;

  font-size: 13px;
  font-weight: 700;

  color: #64748b;
}

/* LAYOUT */
.layout {
  display: grid;

  grid-template-columns: 2fr 1fr;

  gap: 24px;
}

/* PANEL */
.panel {
  background: rgba(255, 255, 255, 0.85);

  border-radius: 28px;

  padding: 28px;

  backdrop-filter: blur(10px);

  border: 1px solid rgba(226, 232, 240, 0.9);

  box-shadow: 0 15px 40px rgba(15, 23, 42, 0.06);
}

.panel h2 {
  font-size: 24px;
  font-weight: 900;

  margin-bottom: 24px;
}

/* PLAYERS */
.players {
  display: flex;
  flex-direction: column;

  gap: 16px;
}

.playerCard {
  display: flex;
  align-items: center;

  gap: 16px;

  padding: 16px;

  border-radius: 22px;

  background: linear-gradient(135deg, #ffffff, #f8fafc);

  border: 1px solid #e2e8f0;

  transition: 0.25s ease;
}

.playerCard:hover {
  transform: translateY(-3px);

  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
}

.playerCard img {
  width: 64px;
  height: 64px;

  border-radius: 18px;

  object-fit: cover;
}

.player-info b {
  display: block;

  font-size: 15px;
  font-weight: 800;
}

.player-info small {
  color: #64748b;

  font-size: 13px;
}

.mini-stats {
  margin-left: auto;

  display: flex;
  align-items: center;

  gap: 10px;
}

.stat-pill {
  display: flex;
  align-items: center;
  justify-content: center;

  min-width: 52px;

  padding: 10px 14px;

  border-radius: 14px;

  font-size: 13px;
  font-weight: 900;

  color: white;
}

.goals {
  background: linear-gradient(135deg, #16a34a, #22c55e);

  box-shadow: 0 8px 20px rgba(34, 197, 94, 0.25);
}

.assists {
  background: linear-gradient(135deg, #2563eb, #3b82f6);

  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.25);
}

/* MATCH */
.match {
  padding: 18px;

  border-radius: 20px;

  background: #f8fafc;

  border: 1px solid #e2e8f0;

  margin-bottom: 14px;
}

.match.next {
  background: linear-gradient(135deg, #22c55e, #16a34a);

  color: white;

  border: none;
}

/* TABLET */
@media (max-width: 1024px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .hero {
    padding: 80px 28px 34px;
  }

  .hero h1 {
    font-size: 32px;
  }
}

/* MOBILE */
@media (max-width: 768px) {
  .club {
    padding: 14px;
  }

  .hero {
    border-radius: 24px;

    padding: 90px 18px 26px;
  }

  .action-bar {
    top: 16px;
    right: 16px;
    left: 16px;
  }

  .action-bar button {
    width: 100%;
  }

  .logo-wrapper {
    width: 120px;
    height: 120px;
  }

  .hero h1 {
    font-size: 24px;
  }

  .hero-stats {
    grid-template-columns: 1fr;
  }

  .playerCard {
    flex-direction: column;
    align-items: flex-start;
  }

  .mini-stats {
    margin-left: 0;

    width: 100%;
  }
}

/* SMALL MOBILE */
@media (max-width: 480px) {
  .hero {
    padding: 85px 14px 20px;
  }

  .logo-wrapper {
    width: 95px;
    height: 95px;
  }

  .hero h1 {
    font-size: 20px;
  }
}
</style>
