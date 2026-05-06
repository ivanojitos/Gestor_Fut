<template>
  <div class="club">
    <!-- HERO -->
    <section class="hero">
      <div class="hero-bg"></div>

      <div class="logo-wrapper">
        <img v-if="team.logo" :src="encodeURI(API + team.logo)" />
      </div>

      <h1>{{ team.name }}</h1>
      <p>{{ team.liga }} • {{ team.categoria }}</p>

      <div class="hero-stats">
        <div>
          <b>{{ team.wins }}</b
          ><span>Ganados</span>
        </div>
        <div>
          <b>{{ team.losses }}</b
          ><span>Perdidos</span>
        </div>
        <div>
          <b>#{{ team.position }}</b
          ><span>Posición</span>
        </div>
      </div>
    </section>

    <!-- ACTION -->
    <div class="action-bar">
      <button @click="goToGameMode">🎮 MODO DT</button>
    </div>

    <!-- CONTENT -->
    <section class="layout">
      <!-- PLAYERS -->
      <div class="panel">
        <h2>Plantilla</h2>

        <div class="players">
          <div v-for="p in players" :key="p.number" class="playerCard">
            <img v-if="p.photo" :src="encodeURI(API + p.photo)" />

            <div>
              <b>#{{ p.number }} {{ p.name }}</b>
              <small>{{ p.position }}</small>
            </div>

            <div class="mini-stats">⚽ {{ p.goals }} | 🎯 {{ p.assists }}</div>
          </div>
        </div>
      </div>

      <!-- MATCHES -->
      <div class="panel">
        <h2>Partidos</h2>

        <div class="match next">
          <p>
            <b>{{ matches.next.home }}</b> vs <b>{{ matches.next.away }}</b>
          </p>
          <small>{{ matches.next.stadium }}</small>
        </div>

        <div v-for="m in matches.last" :key="m.id" class="match">
          {{ m.home }} {{ m.score }} {{ m.away }}
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
  // "http://192.168.11.28:8080";

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

    console.log(equipo);

    // 🔥 SET TEAM
    team.value = {
      id: equipo.Id,
      name: equipo.Nombre,
      logo: equipo.Logo?.replace(/\s+/g, "").trim(),
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
      photo: p.Foto?.replace(/\s+/g, "").trim(),
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
  background: linear-gradient(135deg, #f8fafc, #e2e8f0);
  min-height: 100vh;
  padding: 20px;
  font-family: "Inter", sans-serif;
}

/* HERO */
.hero {
  position: relative;
  text-align: center;
  padding: 60px 20px 40px;
  border-radius: 25px;
  overflow: hidden;

  background: linear-gradient(135deg, #ffffff, #f1f5f9);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

/* 🔥 FONDO DECORATIVO */
.hero-bg {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at top, #22c55e33, transparent 70%);
  z-index: 0;
}

/* 🔥 LOGO PROTAGONISTA */
.logo-wrapper {
  position: relative;
  z-index: 2;

  width: 170px;
  height: 170px;
  margin: auto;

  border-radius: 50%;
  padding: 12px;

  background: linear-gradient(135deg, #ffffff, #e2e8f0);

  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.15),
    inset 0 0 10px rgba(255, 255, 255, 0.6);

  transition: 0.3s;
}

.logo-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
}

/* 🔥 EFECTO HOVER */
.logo-wrapper:hover {
  transform: scale(1.05);
  box-shadow:
    0 15px 40px rgba(0, 0, 0, 0.25),
    0 0 25px rgba(34, 197, 94, 0.4);
}

/* TEXTOS */
.hero h1 {
  margin-top: 20px;
  font-size: 28px;
  font-weight: 900;
  color: #0f172a;
}

.hero p {
  color: #64748b;
  font-size: 14px;
  margin-top: 5px;
}

/* STATS */
.hero-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 25px;
}

.hero-stats div {
  text-align: center;
}

.hero-stats b {
  font-size: 22px;
  color: #16a34a;
}

.hero-stats span {
  display: block;
  font-size: 11px;
  color: #94a3b8;
}
/* ACTION */
.action-bar {
  text-align: center;
  margin: 20px 0;
}

.action-bar button {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  border: none;
  padding: 12px 25px;
  border-radius: 999px;
  color: white;
  font-weight: bold;
  cursor: pointer;
}

/* LAYOUT */
.layout {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 15px;
}

.panel {
  background: white;
  border-radius: 16px;
  padding: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
}

/* PLAYERS */
.playerCard {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-radius: 12px;
  transition: 0.2s;
}

.playerCard:hover {
  background: #f1f5f9;
}

.playerCard img {
  width: 40px;
  border-radius: 50%;
}

.mini-stats {
  margin-left: auto;
  font-size: 12px;
}

/* MATCH */
.match {
  background: #f1f5f9;
  padding: 10px;
  border-radius: 10px;
  margin-top: 10px;
}

.next {
  background: #22c55e;
  color: white;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .layout {
    grid-template-columns: 1fr;
  }

  .logo-wrapper {
    width: 90px;
    height: 90px;
  }
}
</style>
