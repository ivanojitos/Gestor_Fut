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

        <!-- <p v-else>No hay próximo partido</p>

         HISTORIAL 
        <h3 style="margin-top: 20px"> Historial</h3>

        <div v-if="lastMatches.length">
          <div v-for="m in lastMatches" :key="m.id" class="match">
            {{ m.home }} vs {{ m.away }}

            <br />

            <small>
              {{ formatDateTime(m.date, m.time) }}
            </small>
          </div>
        </div> -->
      </div>
    </section>

    <!-- PLAYNEXUS BOOST -->
    <div class="panel bonus-panel">
      <div class="bonus-header">
        <h2>🏆 Fondo de Objetivos</h2>

        <p>
          Fondea tu equipo hacia un objetivo deportivo. Si tu club cumple el
          reto, PlayNexus devuelve tu fondo más el beneficio correspondiente.
        </p>
      </div>

      <div class="bonus-grid">
        <!-- OPCION 1 -->
        <div
          class="bonus-card"
          :class="{ active: selectedBonus === 'campeon' }"
          @click="selectBonus('campeon')"
        >
          <div class="bonus-top">
            <span class="bonus-badge gold">TOP</span>

            <h3>Ser Campeones</h3>
          </div>

          <p class="bonus-desc">
            Impulsa a tu club hasta levantar el campeonato.
          </p>

          <div class="bonus-money">
            <div>
              <small>Fondeo</small>
              <strong>$2,000 MXN</strong>
            </div>

            <div>
              <small>Retorno</small>
              <strong>$4,000 MXN</strong>
            </div>
          </div>
        </div>

        <!-- OPCION 2 -->
        <div
          class="bonus-card"
          :class="{ active: selectedBonus === 'cuartos' }"
          @click="selectBonus('cuartos')"
        >
          <div class="bonus-top">
            <span class="bonus-badge blue">PRO</span>

            <h3>Ganar Cuartos</h3>
          </div>

          <p class="bonus-desc">
            Lleva a tu equipo a superar la fase de cuartos.
          </p>

          <div class="bonus-money">
            <div>
              <small>Fondeo</small>
              <strong>$1,000 MXN</strong>
            </div>

            <div>
              <small>Retorno</small>
              <strong>$2,000 MXN</strong>
            </div>
          </div>
        </div>

        <!-- OPCION 3 -->
        <div
          class="bonus-card"
          :class="{ active: selectedBonus === 'octavos' }"
          @click="selectBonus('octavos')"
        >
          <div class="bonus-top">
            <span class="bonus-badge green">START</span>

            <h3>Ganar Octavos</h3>
          </div>

          <p class="bonus-desc">Cumple el reto inicial y fortalece al club.</p>

          <div class="bonus-money">
            <div>
              <small>Fondeo</small>
              <strong>$500 MXN</strong>
            </div>

            <div>
              <small>Retorno</small>
              <strong>$1,000 MXN</strong>
            </div>
          </div>
        </div>
      </div>

      <!-- DATOS TRANSFERENCIA -->
      <transition name="fadeUp">
        <div v-if="selectedBonus" class="transfer-box">
          <div class="transfer-header">
            <h3>💳 Datos para fondeo</h3>

            <span class="selected-plan">
              {{
                selectedBonus === "campeon"
                  ? "Ser Campeones"
                  : selectedBonus === "cuartos"
                    ? "Ganar Cuartos"
                    : "Ganar Octavos"
              }}
            </span>
          </div>

          <div class="transfer-grid">
            <!-- DATOS BANCARIOS -->
            <div class="transfer-item">
              <small>Banco</small>
              <strong>BBVA</strong>
            </div>

            <div class="transfer-item">
              <small>Cuenta</small>
              <strong>4152-3137-9846-6608</strong>
            </div>

            <div class="transfer-item">
              <small>CLABE</small>
              <strong>012650015187926511</strong>
            </div>

            <div class="transfer-item">
              <small>Referencia</small>
              <strong>
                {{
                  `${team.name} ${team.liga} ${team.categoria} ${
                    selectedBonus === "campeon"
                      ? "CAMPEON"
                      : selectedBonus === "cuartos"
                        ? "CUARTOS"
                        : "OCTAVOS"
                  }`
                }}
              </strong>
            </div>

            <!-- 🔥 DATOS DEL JUGADOR -->
            <div class="transfer-item full">
              <small>Nombre del Titular</small>

              <input
                v-model="paymentData.nombre"
                type="text"
                placeholder="Nombre completo"
              />
            </div>

            <div class="transfer-item full">
              <small>CLABE Bancaria</small>

              <input
                v-model="paymentData.clabe"
                type="text"
                maxlength="18"
                placeholder="Ingresa tu CLABE"
              />
            </div>
          </div>

          <!-- 🔥 BOTÓN -->
          <div class="transfer-actions">
            <button class="save-btn" @click="guardarDatos">
              💾 Guardar Datos
            </button>
          </div>

          <div class="transfer-note">
            <div class="transfer-note">
              ✅ Una vez realizado el fondeo, tu equipo quedará registrado
              automáticamente en el objetivo seleccionado.

              <br /><br />

              🟢 Cuando el pago sea validado correctamente, aparecerá una
              bandera verde indicando que tu fondeo fue exitoso.

              <br /><br />

              🏆 Al finalizar el partido o fase seleccionada, si tu equipo
              cumple el objetivo, el retorno correspondiente será abonado
              automáticamente a la cuenta registrada.

              <br /><br />

              ⚠️ Verifica cuidadosamente tus datos y referencia de pago para
              evitar cualquier inconveniente en la validación del fondeo.
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter, useRoute } from "vue-router";

const API =
  "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";
  // "http://192.168.11.28:8080";
  // "http://192.168.11.217:8080";
// "http://192.168.100.228:8080";

const router = useRouter();
const route = useRoute();

/* =========================
   BONUS PLAYNEXUS
========================= */
const selectedBonus = ref(null);

const selectBonus = (type) => {
  selectedBonus.value = type;
};

const paymentData = ref({
  nombre: "",
  clabe: "",
});

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

const guardarDatos = () => {
  if (!paymentData.value.nombre || !paymentData.value.clabe) {
    alert("Completa todos los datos bancarios");
    return;
  }

  console.log("Datos guardados:", paymentData.value);

  alert("✅ Datos bancarios guardados correctamente");
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
.transfer-actions {
  margin-top: 24px;

  display: flex;
  justify-content: flex-end;
}

.save-btn {
  border: none;

  background: linear-gradient(135deg, #22c55e, #16a34a);

  color: white;

  padding: 14px 22px;

  border-radius: 16px;

  font-size: 14px;
  font-weight: 800;

  cursor: pointer;

  transition: 0.25s ease;

  box-shadow:
    0 10px 25px rgba(34, 197, 94, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.save-btn:hover {
  transform: translateY(-2px);

  box-shadow:
    0 16px 30px rgba(34, 197, 94, 0.35),
    0 0 20px rgba(34, 197, 94, 0.2);
}

/* MOBILE */
@media (max-width: 768px) {
  .transfer-actions {
    justify-content: center;
  }

  .save-btn {
    width: 100%;
  }
}
.transfer-item input {
  width: 100%;

  margin-top: 10px;

  padding: 14px;

  border-radius: 14px;

  border: 1px solid rgba(255, 255, 255, 0.1);

  background: rgba(255, 255, 255, 0.08);

  color: white;

  outline: none;

  font-size: 14px;

  transition: 0.25s ease;
}

.transfer-item input:focus {
  border-color: #22c55e;

  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
}

.transfer-item.full {
  grid-column: span 2;
}

/* MOBILE */
@media (max-width: 900px) {
  .transfer-item.full {
    grid-column: span 1;
  }
}
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

/* =========================================
   BONUS PLAYNEXUS
========================================= */

.bonus-panel {
  margin-top: 24px;
  overflow: hidden;
  position: relative;
}

.bonus-header h2 {
  margin-bottom: 12px;
}

.bonus-header p {
  color: #64748b;
  line-height: 1.6;
  font-size: 14px;
  max-width: 750px;
}

/* GRID */
.bonus-grid {
  margin-top: 28px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

/* CARD */
.bonus-card {
  position: relative;
  padding: 24px;
  border-radius: 24px;
  cursor: pointer;
  overflow: hidden;
  transition: 0.3s ease;
  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
}

.bonus-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 35px rgba(15, 23, 42, 0.1);
}

/* ACTIVE */
.bonus-card.active {
  border: 2px solid #22c55e;
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.08),
    rgba(255, 255, 255, 1)
  );

  box-shadow:
    0 0 30px rgba(34, 197, 94, 0.18),
    0 15px 30px rgba(34, 197, 94, 0.12);
}

/* TOP */
.bonus-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.bonus-top h3 {
  font-size: 20px;
  font-weight: 900;
  color: #0f172a;
}

/* BADGES */
.bonus-badge {
  padding: 8px 12px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 900;
  color: white;
}

.gold {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
}

.blue {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
}

.green {
  background: linear-gradient(135deg, #16a34a, #22c55e);
}

/* DESC */
.bonus-desc {
  color: #64748b;
  font-size: 14px;
  line-height: 1.6;
  min-height: 50px;
}

/* MONEY */
.bonus-money {
  margin-top: 24px;
  display: flex;
  justify-content: space-between;
  gap: 14px;
}

.bonus-money div {
  flex: 1;
  padding: 16px;
  border-radius: 18px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.bonus-money small {
  display: block;
  color: #64748b;
  margin-bottom: 8px;
  font-size: 12px;
  font-weight: 700;
}

.bonus-money strong {
  font-size: 18px;
  font-weight: 900;
  color: #0f172a;
}

/* TRANSFER BOX */
.transfer-box {
  margin-top: 30px;
  padding: 28px;
  border-radius: 28px;
  background: linear-gradient(135deg, #0f172a, #111827);
  color: white;
  box-shadow:
    0 20px 40px rgba(15, 23, 42, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
}

/* HEADER */
.transfer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
}

.transfer-header h3 {
  font-size: 24px;
  font-weight: 900;
}

.selected-plan {
  padding: 10px 16px;
  border-radius: 999px;
  background: rgba(34, 197, 94, 0.15);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #86efac;
  font-size: 12px;
  font-weight: 800;
}

/* GRID */
.transfer-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 18px;
}

/* ITEM */
.transfer-item {
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.transfer-item small {
  display: block;
  margin-bottom: 10px;
  color: #94a3b8;
  font-size: 12px;
  font-weight: 700;
}

.transfer-item strong {
  font-size: 17px;
  font-weight: 900;
  word-break: break-word;
}

/* NOTE */
.transfer-note {
  margin-top: 24px;
  padding: 18px;
  border-radius: 18px;
  background: rgba(34, 197, 94, 0.08);
  border: 1px solid rgba(34, 197, 94, 0.2);
  color: #bbf7d0;
  line-height: 1.6;
  font-size: 14px;
}

/* ANIM */
.fadeUp-enter-active,
.fadeUp-leave-active {
  transition: all 0.3s ease;
}

.fadeUp-enter-from,
.fadeUp-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* MOBILE */
@media (max-width: 900px) {
  .bonus-grid {
    grid-template-columns: 1fr;
  }

  .transfer-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .transfer-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .bonus-top {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .bonus-money {
    flex-direction: column;
  }
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
