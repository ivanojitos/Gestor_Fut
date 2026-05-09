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
          <img :src="proximo.local.logo" />
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
          <img :src="proximo.visitante.logo" />
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

        <div class="match-footer">🏟️ {{ match.cancha }}</div>
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

    const nuevos = data.data.map((m) => ({
      id: m.Id,

      fecha: m.Fecha_Juego,

      cancha: m.cancha,

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
.load-more-wrapper {
  display: flex;
  justify-content: center;
  margin-top: 30px;
}

.load-more {
  border: none;
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  padding: 14px 24px;
  border-radius: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.3s;
}

.load-more:hover {
  transform: translateY(-3px);
}

.end-text {
  color: #64748b;
  font-weight: 600;
}
.container {
  min-height: 100vh;
  padding: 20px;
  background: #f1f5f9;
}

/* HEADER */

.glass {
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.header {
  padding: 30px;
  border-radius: 28px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.badge {
  background: #dcfce7;
  color: #16a34a;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: bold;
}

.header h1 {
  font-size: 38px;
  margin: 12px 0;
  color: #0f172a;
}

.header p {
  color: #64748b;
}

.header-icon {
  width: 90px;
  height: 90px;
  border-radius: 24px;
  background: linear-gradient(135deg, #22c55e, #3b82f6);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 42px;
  color: white;
}

/* 🔥 NEXT MATCH */

.next-match {
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: white;
  border-radius: 30px;
  padding: 30px;
  margin-bottom: 30px;
  overflow: hidden;
  position: relative;
}

.next-header span {
  color: #94a3b8;
  font-size: 12px;
  letter-spacing: 1px;
  font-weight: 700;
}

.next-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 25px;
  gap: 20px;
}

.team-block {
  flex: 1;
  text-align: center;
}

.team-block img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  border: 4px solid rgba(255, 255, 255, 0.1);
}

.team-block h3 {
  margin-top: 14px;
  font-size: 22px;
}

.center-info {
  text-align: center;
}

.time {
  font-size: 30px;
  font-weight: 800;
}

.vs {
  margin: 14px 0;
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: linear-gradient(135deg, #22c55e, #3b82f6);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-inline: auto;
  font-weight: bold;
}

.date {
  margin-top: 10px;
  color: #cbd5e1;
}

.field {
  margin-top: 8px;
  color: #94a3b8;
}

/* 🔥 HISTORY */

.history-title {
  font-size: 24px;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 20px;
}

.match-card {
  background: white;
  border-radius: 24px;
  padding: 20px;
  margin-bottom: 18px;
  border: 1px solid #e2e8f0;
  transition: 0.3s;
}

.match-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.06);
}

.match-date {
  color: #64748b;
  margin-bottom: 16px;
  font-weight: 600;
}

.match-teams {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  flex: 1;
}

.team img {
  width: 60px;
  height: 60px;
  border-radius: 50%;
}

.result {
  font-size: 28px;
  font-weight: 800;
  color: #0f172a;
}

.match-footer {
  margin-top: 20px;
  color: #64748b;
  text-align: center;
}

/* 📱 MOBILE */

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }

  .next-content {
    flex-direction: column;
  }

  .match-teams {
    gap: 10px;
  }

  .header h1 {
    font-size: 28px;
  }

  .team-block img {
    width: 70px;
    height: 70px;
  }

  .time {
    font-size: 24px;
  }
}
</style>
