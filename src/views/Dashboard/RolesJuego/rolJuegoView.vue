<template>
  <div class="container">
    <!-- HEADER -->
    <div class="header glass">
      <div>
        <span class="badge">⚽ Mi Equipo</span>
        <h1>Mis Partidos</h1>
        <p>Consulta tus próximos encuentros y tu historial reciente.</p>
      </div>

      <div class="header-icon">🏆</div>
    </div>

    <!-- 🔥 PROXIMO PARTIDO -->
    <div v-if="proximo" class="next-match">
      <div class="next-header">
        <span>PRÓXIMO PARTIDO</span>
      </div>

      <div class="next-content">
        <div class="team-block">
          <img
            :src="
              proximo.local.logo
                ? encodeURI(API + proximo.local.logo.replace(/\s+/g, '').trim())
                : placeholder
            "
          />
          <h3>{{ proximo.local.nombre }}</h3>
        </div>

        <div class="center-info">
          <div class="time">
            {{ proximo.hora }}
          </div>

          <div class="vs">VS</div>

          <div class="date">
            {{ formatearFecha(proximo.fecha) }}
          </div>

          <div class="field">🏟️ {{ proximo.cancha }}</div>
        </div>

        <div class="team-block">
           <img
            :src="
              proximo.visitante.logo
                ? encodeURI(API + proximo.visitante.logo.replace(/\s+/g, '').trim())
                : placeholder
            "
          />

          <h3>{{ proximo.visitante.nombre }}</h3>
        </div>
      </div>
    </div>

    <!-- 🔥 HISTORIAL -->
    <div class="history">
      <div class="history-title">Historial de Partidos</div>

      <div class="match-card" v-for="match in anteriores" :key="match.id">
        <div class="match-date">
          {{ formatearFecha(match.fecha) }}
        </div>

        <div class="match-teams">
          <div class="team">
            <img :src="match.local.logo" />
            <span>{{ match.local.nombre }}</span>
          </div>

          <div class="result">
            {{ match.marcador || "VS" }}
          </div>

          <div class="team">
            <img :src="match.visitante.logo" />
            <span>{{ match.visitante.nombre }}</span>
          </div>
        </div>

        <div class="match-footer">Cancha :🏟️ {{ match.cancha }}</div>
      </div>
    </div>

    <div class="load-more-wrapper">
      <button
        v-if="!noMore"
        class="load-more"
        @click="cargarMas"
        :disabled="loading"
      >
        {{ loading ? "Cargando..." : "Cargar más" }}
      </button>

      <p v-else class="end-text">⚽ No hay más partidos</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const API =
  "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";
// "http://192.168.11.28:8080";
// "http://192.168.100.228:8080";

const proximo = ref(null);
const anteriores = ref([]);
const page = ref(1);
const loading = ref(false);
const noMore = ref(false);

const storedUser = JSON.parse(localStorage.getItem("user"));

const idEquipo = ref(null);

onMounted(async () => {
  obtenerPartidos();
});

const obtenerEquipoJugador = async () => {
  try {
    if (!storedUser?.Id) return;

    const { data } = await axios.get(
      `${API}/api/equipos/jugador/${storedUser.Id}`,
    );

    const equipo = data.data?.[0];

    if (!equipo) {
      console.log("Jugador sin equipo");
      return;
    }

    idEquipo.value = equipo.Id;

    await obtenerPartidos();
  } catch (error) {
    console.error(error);
  }
};

const obtenerPartidos = async () => {
  try {
    // 🔥 VALIDAR
    if (!idEquipo.value) return;

    loading.value = true;

    const { data } = await axios.get(
      `${API}/api/partidos-equipo/${idEquipo.value}`,
      {
        params: {
          page: page.value,
          limit: 10,
        },
      },
    );

    if (data.data.length < 10) {
      noMore.value = true;
    }

    console.log(data.data);

    const nuevos = data.data.map((m) => ({
      id: m.Id,

      fecha: m.Fecha_Juego,

      cancha: m.Id_Cancha,

      marcador:
        m.Goles_Local != null && m.Goles_Visitante != null
          ? `${m.Goles_Local} - ${m.Goles_Visitante}`
          : null,

      local: {
        nombre: m.local_nombre,
        logo: API + m.local_logo,
      },

      visitante: {
        nombre: m.visitante_nombre,
        logo: API + m.visitante_logo,
      },
    }));

    anteriores.value = [...anteriores.value, ...nuevos];
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const cargarMas = async () => {
  page.value++;

  await obtenerPartidos();
};

const formatearFecha = (fecha) => {
  if (!fecha) return "";

  const date = new Date(fecha);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  return `${day}/${month}/${year}`;
};

onMounted(async () => {
  await obtenerEquipoJugador();
});
</script>

<style scoped>
/* =========================================================
🔥 CONTENEDOR GENERAL
========================================================= */

.container {
  min-height: 100vh;
  padding: 24px;
  background: #f1f5f9;
  position: relative;
  overflow: hidden;
  font-family: "Inter", sans-serif;
}

/* DECORACIÓN */
.container::before,
.container::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  z-index: 0;
}

.container::before {
  width: 320px;
  height: 320px;
  background: rgba(34, 197, 94, 0.08);
  top: -120px;
  left: -120px;
}

.container::after {
  width: 280px;
  height: 280px;
  background: rgba(59, 130, 246, 0.08);
  bottom: -120px;
  right: -120px;
}

.container > * {
  position: relative;
  z-index: 1;
}

/* =========================================================
🔥 HEADER
========================================================= */

.glass {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.7);
}

.header {
  padding: 34px;
  border-radius: 34px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 10px 40px rgba(15, 23, 42, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.header::before {
  content: "";
  position: absolute;
  width: 260px;
  height: 260px;
  background: rgba(34, 197, 94, 0.08);
  border-radius: 50%;
  top: -150px;
  right: -80px;
}

.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, #dcfce7, #bbf7d0);
  color: #15803d;
  padding: 8px 16px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 1px;
  box-shadow: 0 4px 12px rgba(34, 197, 94, 0.15);
}

.header h1 {
  font-size: 50px;
  margin: 14px 0 10px;
  color: #0f172a;
  font-weight: 900;
  line-height: 1;
}

.header p {
  color: #64748b;
  font-size: 15px;
  max-width: 520px;
  line-height: 1.7;
}

.header-icon {
  width: 120px;
  height: 120px;
  border-radius: 32px;
  background: linear-gradient(135deg, #22c55e, #3b82f6);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 56px;
  color: white;
  box-shadow:
    0 25px 50px rgba(34, 197, 94, 0.28),
    inset 0 1px 0 rgba(255, 255, 255, 0.25);
  animation: float 4s ease-in-out infinite;
}

/* =========================================================
🔥 PRÓXIMO PARTIDO
========================================================= */

.next-match {
  background: linear-gradient(
    135deg,
    rgba(15, 23, 42, 0.98),
    rgba(30, 41, 59, 0.96)
  );
  color: white;
  border-radius: 36px;
  padding: 40px;
  margin-bottom: 34px;
  overflow: hidden;
  position: relative;
  box-shadow: 0 25px 60px rgba(15, 23, 42, 0.24);
}

.next-match::before {
  content: "";
  position: absolute;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: rgba(34, 197, 94, 0.08);
  top: -250px;
  right: -180px;
}

.next-match::after {
  content: "";
  position: absolute;
  width: 260px;
  height: 260px;
  border-radius: 50%;
  background: rgba(59, 130, 246, 0.08);
  bottom: -120px;
  left: -120px;
}

.next-header {
  display: flex;
  justify-content: center;
}

.next-header span {
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 10px 18px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 2px;
  color: #cbd5e1;
}

.next-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 34px;
  gap: 26px;
  position: relative;
  z-index: 2;
}

/* EQUIPOS */

.team-block {
  flex: 1;
  text-align: center;
}

.team-block img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  object-fit: cover;
  padding: 10px;
  background: rgba(255, 255, 255, 0.08);
  border: 4px solid rgba(255, 255, 255, 0.08);
  transition: 0.4s;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.25);
}

.team-block img:hover {
  transform: scale(1.08) rotate(4deg);
}

.team-block h3 {
  margin-top: 18px;
  font-size: 24px;
  font-weight: 800;
}

/* CENTRO */

.center-info {
  text-align: center;
  min-width: 240px;
}

.time {
  font-size: 44px;
  font-weight: 900;
  letter-spacing: 1px;
}

.vs {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  margin: 22px auto;
  background: linear-gradient(135deg, #22c55e, #3b82f6);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  font-weight: 900;
  box-shadow: 0 15px 35px rgba(34, 197, 94, 0.35);
  animation: pulse 2s infinite;
}

.date {
  margin-top: 12px;
  color: #e2e8f0;
  font-weight: 600;
  font-size: 16px;
}

.field {
  margin-top: 10px;
  color: #94a3b8;
  font-size: 14px;
}

/* =========================================================
🔥 HISTORIAL
========================================================= */

.history {
  margin-top: 20px;
}

.history-title {
  font-size: 32px;
  font-weight: 900;
  color: #0f172a;
  margin-bottom: 24px;
  position: relative;
  padding-left: 18px;
}

.history-title::before {
  content: "";
  position: absolute;
  left: 0;
  top: 6px;
  width: 6px;
  height: 38px;
  border-radius: 999px;
  background: linear-gradient(180deg, #22c55e, #3b82f6);
}

/* =========================================================
🔥 TARJETAS
========================================================= */

.match-card {
  background: rgba(255, 255, 255, 0.76);
  backdrop-filter: blur(14px);
  border-radius: 30px;
  padding: 24px;
  margin-bottom: 22px;
  border: 1px solid rgba(255, 255, 255, 0.7);
  transition: all 0.35s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.05);
}

.match-card::before {
  content: "";
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(34, 197, 94, 0.03),
    rgba(59, 130, 246, 0.03)
  );
  opacity: 0;
  transition: 0.35s;
}

.match-card:hover::before {
  opacity: 1;
}

.match-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 50px rgba(15, 23, 42, 0.1);
}

.match-date {
  display: inline-flex;
  align-items: center;
  background: #f8fafc;
  padding: 8px 14px;
  border-radius: 999px;
  color: #64748b;
  margin-bottom: 18px;
  font-size: 13px;
  font-weight: 700;
}

.match-teams {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

/* TEAM */

.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  flex: 1;
  text-align: center;
}

.team img {
  width: 84px;
  height: 84px;
  border-radius: 50%;
  object-fit: cover;
  padding: 6px;
  background: white;
  border: 3px solid #f1f5f9;
  transition: 0.35s;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
}

.team img:hover {
  transform: scale(1.08);
}

.team span {
  font-size: 16px;
  font-weight: 700;
  color: #0f172a;
}

/* RESULTADO */

.result {
  min-width: 110px;
  text-align: center;
  font-size: 34px;
  font-weight: 900;
  color: #0f172a;
  padding: 16px 20px;
  border-radius: 24px;
  background: linear-gradient(135deg, #f8fafc, #ffffff);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.8),
    0 10px 25px rgba(15, 23, 42, 0.05);
}

.match-footer {
  margin-top: 22px;
  color: #64748b;
  text-align: center;
  font-weight: 600;
  font-size: 14px;
  padding-top: 18px;
  border-top: 1px solid #e2e8f0;
}

/* =========================================================
🔥 BOTÓN
========================================================= */

.load-more-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 34px;
}

.load-more {
  border: none;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  padding: 16px 30px;
  border-radius: 18px;
  font-weight: 800;
  font-size: 15px;
  cursor: pointer;
  transition: 0.35s;
  box-shadow: 0 15px 35px rgba(34, 197, 94, 0.25);
}

.load-more:hover {
  transform: translateY(-4px) scale(1.03);
}

.load-more:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.end-text {
  color: #64748b;
  font-weight: 700;
  font-size: 15px;
}

/* =========================================================
🔥 TABLET
========================================================= */

@media (max-width: 1024px) {
  .container {
    padding: 20px;
  }

  .header {
    padding: 28px;
  }

  .header h1 {
    font-size: 40px;
  }

  .header-icon {
    width: 100px;
    height: 100px;
    font-size: 46px;
  }

  .team-block img {
    width: 100px;
    height: 100px;
  }

  .time {
    font-size: 36px;
  }

  .result {
    font-size: 30px;
  }
}

/* =========================================================
🔥 MOBILE
========================================================= */

@media (max-width: 768px) {
  .container {
    padding: 14px;
  }

  /* HEADER */

  .header {
    flex-direction: column;
    gap: 24px;
    align-items: flex-start;
    padding: 24px;
    border-radius: 28px;
  }

  .header h1 {
    font-size: 34px;
  }

  .header p {
    font-size: 14px;
  }

  .header-icon {
    width: 88px;
    height: 88px;
    border-radius: 24px;
    font-size: 40px;
    align-self: center;
  }

  /* NEXT MATCH */

  .next-match {
    padding: 24px;
    border-radius: 28px;
  }

  .next-content {
    flex-direction: column;
    gap: 28px;
  }

  .team-block img {
    width: 92px;
    height: 92px;
  }

  .team-block h3 {
    font-size: 18px;
  }

  .center-info {
    min-width: unset;
  }

  .time {
    font-size: 34px;
  }

  .vs {
    width: 74px;
    height: 74px;
    font-size: 20px;
  }

  /* HISTORY */

  .history-title {
    font-size: 26px;
  }

  /* CARD */

  .match-card {
    padding: 18px;
    border-radius: 24px;
  }

  .match-teams {
    gap: 12px;
  }

  .team img {
    width: 68px;
    height: 68px;
  }

  .team span {
    font-size: 13px;
  }

  .result {
    min-width: 80px;
    font-size: 24px;
    padding: 12px 14px;
    border-radius: 18px;
  }

  .match-footer {
    font-size: 13px;
  }

  .load-more {
    width: 100%;
  }
}

/* =========================================================
🔥 CELULARES PEQUEÑOS
========================================================= */

@media (max-width: 480px) {
  .header {
    padding: 20px;
  }

  .header h1 {
    font-size: 28px;
  }

  .header-icon {
    width: 78px;
    height: 78px;
    font-size: 34px;
  }

  .next-match {
    padding: 20px;
  }

  .time {
    font-size: 28px;
  }

  .vs {
    width: 66px;
    height: 66px;
    font-size: 18px;
  }

  .team-block img {
    width: 82px;
    height: 82px;
  }

  .match-card {
    padding: 16px;
  }

  .team img {
    width: 60px;
    height: 60px;
  }

  .team span {
    font-size: 12px;
  }

  .result {
    font-size: 20px;
    min-width: 70px;
  }

  .history-title {
    font-size: 22px;
  }
}

/* =========================================================
🔥 ANIMACIONES
========================================================= */

@keyframes float {
  0% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-8px);
  }

  100% {
    transform: translateY(0px);
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    box-shadow: 0 15px 35px rgba(34, 197, 94, 0.35);
  }

  50% {
    transform: scale(1.06);
    box-shadow: 0 20px 45px rgba(34, 197, 94, 0.45);
  }

  100% {
    transform: scale(1);
    box-shadow: 0 15px 35px rgba(34, 197, 94, 0.35);
  }
}
</style>
