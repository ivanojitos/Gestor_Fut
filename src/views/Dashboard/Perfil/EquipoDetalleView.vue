<template>
  <div class="club">
    <!-- TOP HEADER -->
    <header class="header">
      <div class="teamInfo">
        <img :src="team.logo" class="logo" />

        <div>
          <h1>{{ team.name }}</h1>
          <p class="sub">Season 2026 • Career Mode</p>

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
            <b>{{ matches.next.home }}</b> vs <b>{{ matches.next.away }}</b>
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
import { computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const team = {
  id: 1,
  name: "FIFA CLUB PRO",
  logo: "https://i.pravatar.cc/120?img=32",
  wins: 12,
  losses: 4,
  position: 2,
};

const goToGameMode = () => {
  router.push(`/dashboard/ModoJuego/${team.id}`);
};

const players = [
  { name: "Juan", position: "GK", goals: 0, assists: 1, number: 1 },
  { name: "Carlos", position: "DEF", goals: 2, assists: 3, number: 2 },
  { name: "Luis", position: "DEF", goals: 1, assists: 2, number: 3 },
  { name: "Pedro", position: "DEF", goals: 0, assists: 1, number: 4 },
  { name: "Mario", position: "MID", goals: 3, assists: 5, number: 5 },
  { name: "Raul", position: "MID", goals: 4, assists: 6, number: 6 },
  { name: "Jose", position: "MID", goals: 2, assists: 4, number: 7 },
  { name: "Hugo", position: "ST", goals: 10, assists: 2, number: 8 },
  { name: "Leo", position: "ST", goals: 12, assists: 3, number: 9 },
  { name: "Sergio", position: "ST", goals: 8, assists: 5, number: 10 },
].map((p) => ({
  ...p,
  photo: `https://i.pravatar.cc/100?img=${Math.floor(Math.random() * 70)}`,
}));

const best = computed(() => ({
  gk: players.find((p) => p.position === "GK"),
  def: [...players]
    .filter((p) => p.position === "DEF")
    .sort((a, b) => b.goals + b.assists - (a.goals + a.assists))[0],
  mid: [...players]
    .filter((p) => p.position === "MID")
    .sort((a, b) => b.goals + b.assists - (a.goals + a.assists))[0],
  st: [...players]
    .filter((p) => p.position === "ST")
    .sort((a, b) => b.goals - a.goals)[0],
}));

const matches = {
  next: {
    home: "FIFA CLUB PRO",
    away: "REAL STARS FC",
    stadium: "Estadio Central",
  },
  last: [
    {
      id: 1,
      home: "FIFA CLUB PRO",
      away: "LEGENDS FC",
      score: "3 - 1",
      ref: "Carlos Vega",
      stadium: "Arena Norte",
    },
    {
      id: 2,
      home: "DRAGONS FC",
      away: "FIFA CLUB PRO",
      score: "2 - 2",
      ref: "Miguel Torres",
      stadium: "Estadio Sur",
    },
  ],
};
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
