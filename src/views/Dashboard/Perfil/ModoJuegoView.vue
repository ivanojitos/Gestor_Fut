<template>
  <div class="app">

    <!-- FORMATIONS + TACTICS -->
    <div class="formations">

      <!-- FORMACIONES -->
      <button
        v-for="f in formaciones"
        :key="f.name"
        @click="applyFormation(f)"
        :class="{ active: selectedFormacion.name === f.name }"
      >
        {{ f.name }}
      </button>

      <!-- ESTILOS -->
      <button
        v-for="t in estilosJuego"
        :key="t.name"
        @click="setTactic(t)"
        :class="{ tacticActive: selectedTactic.name === t.name }"
      >
        ⚽ {{ t.name }}
      </button>

    </div>

    <!-- FIELD -->
    <section class="field">
      <div class="pitch"></div>
      <div class="midline"></div>
      <div class="circle"></div>
      <div class="goal top"></div>
      <div class="goal bottom"></div>

      <!-- PLAYERS -->
      <div
        v-for="p in titulares"
        :key="p.number"
        class="player"
        :class="{ selectedRed: selectedPlayer?.number === p.number }"
        :style="{ top: p.y + '%', left: p.x + '%' }"
        @click="selectPlayer(p)"
      >
        <img :src="p.photo" />
        <div>
          <b>#{{ p.number }}</b>
          <small>{{ p.name }}</small>
        </div>
      </div>

    </section>

    <!-- PANEL -->
    <section class="panel">
      <div class="card">
        <h3>Cancha</h3>
        <p>{{ selectedPlayer?.name || 'Ninguno' }}</p>
      </div>

      <div class="card">
        <h3>Estilo de juego</h3>
        <p class="styleActive">{{ selectedTactic.name }}</p>
      </div>

      <button class="swapBtn" @click="swapPlayers" :disabled="!canSwap">
        🔁 HACER CAMBIO
      </button>
    </section>

    <!-- BENCH -->
    <section class="bench">
      <h2>🪑 Banca</h2>

      <div class="grid">
        <div
          v-for="p in banca"
          :key="p.number"
          class="card"
          :class="{ benchSelected: selectedBench?.number === p.number }"
          @click="selectBench(p)"
        >
          <img :src="p.photo" />
          <div>
            <b>#{{ p.number }} {{ p.name }}</b>
            <small>{{ p.position }}</small>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";

/* PLAYERS */
const players = [
  "Juan","Carlos","Luis","Pedro","Mario",
  "Raul","Jose","Hugo","Leo","Sergio"
].map((name, i) => ({
  name,
  number: i + 1,
  position: i % 3 === 0 ? "DEL" : i % 3 === 1 ? "MID" : "DEF",
  photo: `https://i.pravatar.cc/100?img=${i + 20}`
}));

/* 🔥 FORMACIONES PRO */
const formaciones = [
  {
    name: "1-2-3-1",
    map: [
      {x:50,y:85},
      {x:30,y:65},{x:70,y:65},
      {x:20,y:45},{x:50,y:45},{x:80,y:45},
      {x:50,y:25}
    ]
  },
  {
    name: "1-2-2-2",
    map: [
      {x:50,y:85},
      {x:30,y:65},{x:70,y:65},
      {x:30,y:45},{x:70,y:45},
      {x:30,y:25},{x:70,y:25}
    ]
  },
  {
    name: "1-3-3",
    map: [
      {x:50,y:85},
      {x:25,y:60},{x:50,y:60},{x:75,y:60},
      {x:25,y:35},{x:50,y:35},{x:75,y:35}
    ]
  },
  {
    name: "1-3-2-1",
    map: [
      {x:50,y:85},
      {x:25,y:65},{x:50,y:65},{x:75,y:65},
      {x:35,y:45},{x:65,y:45},
      {x:50,y:25}
    ]
  },
  {
    name: "1-4-1-1",
    map: [
      {x:50,y:85},
      {x:20,y:65},{x:40,y:65},{x:60,y:65},{x:80,y:65},
      {x:50,y:45},
      {x:50,y:25}
    ]
  },
  {
    name: "1-4-2",
    map: [
      {x:50,y:85},
      {x:20,y:65},{x:40,y:65},{x:60,y:65},{x:80,y:65},
      {x:35,y:35},{x:65,y:35}
    ]
  }
];

/* ⚽ ESTILOS */
const estilosJuego = [
  {
    name: "Posesión",
    modifier: (p) => ({ x: p.x, y: p.y })
  },
  {
    name: "Contraataque",
    modifier: (p, i) => ({ x: p.x + (i % 2 ? 5 : -5), y: p.y + 2 })
  },
  {
    name: "Presión Alta",
    modifier: (p) => ({ x: p.x, y: p.y - 6 })
  },
  {
    name: "Balones Largos",
    modifier: (p, i) => ({
      x: i === 0 ? 50 : p.x,
      y: i === 0 ? 80 : p.y
    })
  }
];

const selectedFormacion = ref(formaciones[0]);
const selectedTactic = ref(estilosJuego[0]);

const titulares = ref([]);
const banca = ref([]);

const selectedPlayer = ref(null);
const selectedBench = ref(null);

/* 🔥 ENGINE CORE */
function applyFormation(f) {
  selectedFormacion.value = f;
  buildTeam();
}

function setTactic(t) {
  selectedTactic.value = t;
  buildTeam();
}

/* 🧠 MOTOR UNIFICADO */
function buildTeam() {
  const base = selectedFormacion.value.map;

  titulares.value = players.slice(0, 7).map((p, i) => {
    const b = base[i] || { x: 50, y: 50 };
    const mod = selectedTactic.value.modifier(b, i);

    return {
      ...p,
      x: mod.x,
      y: mod.y
    };
  });

  banca.value = players.slice(7);
}

/* SELECT */
function selectPlayer(p) {
  selectedPlayer.value = p;
}

function selectBench(p) {
  selectedBench.value = p;
}

/* SWAP */
function swapPlayers() {
  if (!selectedPlayer.value || !selectedBench.value) return;

  const i = titulares.value.findIndex(p => p.number === selectedPlayer.value.number);
  const j = banca.value.findIndex(p => p.number === selectedBench.value.number);

  if (i === -1 || j === -1) return;

  const temp = titulares.value[i];

  titulares.value[i] = {
    ...banca.value[j],
    x: selectedPlayer.value.x,
    y: selectedPlayer.value.y
  };

  banca.value[j] = temp;

  selectedPlayer.value = null;
  selectedBench.value = null;
}

/* ENABLE */
const canSwap = computed(() =>
  selectedPlayer.value && selectedBench.value
);

/* INIT */
buildTeam();
</script>
<style scoped>

/* BASE FUT */
.app {
  font-family: 'Segoe UI';
  background: radial-gradient(circle at top, #0b1220, #020617);
  color: white;
  padding: 16px;
}

/* FORMATIONS */
.formations {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

button {
  padding: 8px 12px;
  border: none;
  border-radius: 10px;
  background: #1e293b;
  color: white;
  cursor: pointer;
  transition: .2s;
}

.active {
  background: #22c55e;
  color: black;
}

.tacticActive {
  background: #3b82f6;
}

/* FIELD FIFA STYLE */
.field {
  position: relative;
  height: 520px;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 0 40px rgba(0,0,0,0.7);
}

.pitch {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    90deg,
    #16a34a,
    #16a34a 40px,
    #15803d 40px,
    #15803d 80px
  );
}

/* LINES */
.midline {
  position: absolute;
  top: 50%;
  width: 100%;
  height: 2px;
  background: white;
}

.circle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  border: 2px solid white;
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

.goal {
  position: absolute;
  width: 150px;
  height: 10px;
  background: white;
  left: 50%;
  transform: translateX(-50%);
}

.goal.top { top: 0; }
.goal.bottom { bottom: 0; }

/* PLAYER */
.player {
  position: absolute;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 6px;
  align-items: center;
  background: rgba(255,255,255,0.95);
  color: black;
  padding: 6px 10px;
  border-radius: 12px;
  cursor: pointer;
}

.player img {
  width: 32px;
  border-radius: 50%;
}

/* RED SELECT */
.selectedRed {
  background: #ef4444 !important;
  color: white !important;
  transform: translate(-50%, -50%) scale(1.1);
}

/* PANEL */
.panel {
  display: grid;
  grid-template-columns: 1fr 1fr auto;
  gap: 10px;
  margin-top: 10px;
}

.card {
  background: rgba(255,255,255,0.05);
  padding: 10px;
  border-radius: 12px;
}

/* BENCH */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 10px;
}

.bench .card {
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
}

.bench img {
  width: 35px;
  border-radius: 50%;
}

.benchSelected {
  outline: 2px solid #facc15;
  transform: scale(1.05);
}
</style>