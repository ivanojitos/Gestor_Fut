<template>
  <div class="admin">
    <!-- HEADER -->
    <div class="header">
      <div>
        <h2>⚽ Panel de Partidos</h2>
        <p class="subtitle">Gestión y monitoreo de calendario deportivo</p>
      </div>

      <div class="actions">
        <!-- <button class="btn secondary" @click="goToPartidos">
          📋 Programados
        </button> -->
        <button class="btn primary" @click="goToProgramar">
          ➕ Nuevo partido
        </button>
      </div>
    </div>

    <!-- FILTROS -->
    <div class="filters">
      <!-- <select v-model="filters.league">
        <option value="">🏆 Todas las ligas</option>
        <option v-for="l in leagues" :key="l.Id" :value="l.Id">
          {{ l.Nombre }}
        </option>
      </select>

      <select v-model="filters.category">
        <option value="">📂 Todas las categorías</option>
        <option v-for="c in categories" :key="c.Id" :value="c.Id">
          {{ c.Nombre }}
        </option>
      </select> -->

      <div class="date-filter">
        <!-- BOTÓN PRINCIPAL -->
        <div class="date-chip" @click="showCalendar = !showCalendar">
          <span class="icon">📅</span>

          <span class="text">
            <span v-if="filters.date">{{ formatDate(filters.date) }}</span>
            <span v-else>Filtrar por fecha</span>
          </span>

          <span class="arrow">▾</span>
        </div>

        <!-- DROPDOWN -->
        <transition name="fade">
          <div v-if="showCalendar" class="calendar-dropdown">
            <div class="calendar-header">
              <h4>Seleccionar fecha</h4>
              <button @click="showCalendar = false">✕</button>
            </div>

            <input type="date" v-model="filters.date" />

            <div class="quick-actions">
              <button @click="setToday">Hoy</button>
              <button @click="setTomorrow">Mañana</button>
              <button @click="setAll">Limpiar</button>
            </div>
          </div>
        </transition>
      </div>

      <button class="clear" @click="clearFilters">❌ Limpiar</button>
    </div>

    <!-- GRID PARTIDOS -->
    <div
      v-for="[date, matchesByDate] in groupedMatches"
      :key="date"
      class="date-group"
    >
      <!-- HEADER FECHA -->
      <div class="date-header">📅 {{ formatDate(date) }}</div>

      <!-- PARTIDOS DE ESA FECHA -->
      <div class="grid">
        <div v-for="p in matchesByDate" :key="p.Id" class="card">
          <div class="cardHeader">
            <span class="league">🏆 {{ p.Liga }}</span>
            <span class="category">📂 {{ p.Categoria }}</span>
          </div>

          <div class="match">
            <div class="team home">
              <img :src="p.local_logo" />
              <span>{{ p.local }}</span>
            </div>

            <div class="vs">
              <span>VS</span>

              <small class="match-date">
                {{ formatDate(p.Fecha_Juego) }} · {{ p.Hora_Juego }}
              </small>
            </div>

            <div class="team away">
              <img :src="p.visitante_logo" />
              <span>{{ p.visitante }}</span>
            </div>
          </div>

          <div class="footer">
            <span>🏟 {{ p.Id_Cancha }}</span>
            <span>👨‍⚖ {{ p.Arbitro }}</span>
          </div>
        </div>
      </div>
    </div>

    <p v-if="!filteredMatches.length" class="empty">
      No hay partidos con estos filtros
    </p>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const showCalendar = ref(false);

const API =
   "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";
  // "http://192.168.11.28:8080";
  // "http://192.168.100.228:8080";

/* DATA */
const matches = ref([]);
const leagues = ref([]);
const categories = ref([]);

/* FILTROS */
const filters = ref({
  league: "",
  category: "",
  date: "",
});

/* NAV */
const goToProgramar = () => router.push({ name: "ProgramarJuego" });

/* =========================
   NORMALIZADOR DE FECHA
========================= */
const normalizeDate = (date) => {
  if (!date) return "";
  return date.split("T")[0]; // 👈 evita timezone shift
};

const setToday = () => {
  filters.value.date = normalizeDate(new Date().toISOString());
};

const setTomorrow = () => {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  filters.value.date = normalizeDate(d.toISOString());
};

const setAll = () => {
  filters.value.date = "";
};

/* =========================
   LOAD DATA
========================= */
const loadData = async () => {
  try {
    const [p, l, c] = await Promise.all([
      axios.get(`${API}/api/partidosFull`),
      axios.get(`${API}/api/ligas`),
      axios.get(`${API}/api/categorias`),
    ]);

    console.log(p.data?.data);
    
    matches.value = p.data?.data || [];
    leagues.value = l.data?.data || [];
    categories.value = c.data?.data || [];
  } catch (err) {
    console.log(err);
  }
};

/* =========================
   FILTERS (CORREGIDO)
========================= */
const filteredMatches = computed(() => {
  return matches.value.filter((m) => {
    const ligaOk =
      !filters.value.league ||
      String(m.Id_Liga).trim() === String(filters.value.league).trim();

    const catOk =
      !filters.value.category ||
      String(m.Id_Categoria).trim() === String(filters.value.category).trim();

    const fechaOk =
      !filters.value.date ||
      normalizeDate(m.Fecha_Juego) === filters.value.date;

    return ligaOk && catOk && fechaOk;
  });
});

/* =========================
   GROUPED BY DATE
========================= */
const groupedMatches = computed(() => {
  const groups = new Map();

  filteredMatches.value.forEach((m) => {
    const key = normalizeDate(m.Fecha_Juego);

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(m);
  });

  return Array.from(groups.entries()).sort(
    (a, b) => new Date(b[0]) - new Date(a[0]),
  );
});

/* =========================
   FORMAT DISPLAY DATE
========================= */
const formatDate = (dateStr) => {
  if (!dateStr) return "";

  const [year, month, day] = dateStr.split("T")[0].split("-");

  return `${day}-${month}-${year}`;
};

/* =========================
   CLEAR FILTERS
========================= */
const clearFilters = () => {
  filters.value = {
    league: "",
    category: "",
    date: "",
  };
};

watch(
  () => filters.value.date,
  () => {
    showCalendar.value = false;
  },
);

onMounted(loadData);
</script>

<style scoped>
/* =========================
   BASE
========================= */

.admin {
  min-height: 100vh;
  background: #f8fafc;
  padding: 20px;
  font-family: Inter, sans-serif;
}

/* =========================
   HEADER
========================= */

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  flex-wrap: wrap;
  margin-bottom: 15px;
}

.header h2 {
  font-size: 22px;
  font-weight: 800;
  color: #0f172a;
  margin: 0;
}

.subtitle {
  font-size: 13px;
  color: #64748b;
  margin-top: 4px;
}

/* =========================
   BOTONES HEADER
========================= */

.actions {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 14px;
  border-radius: 12px;
  border: none;
  cursor: pointer;
  font-weight: 700;
  transition: 0.25s;
}

.primary {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  color: white;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.2);
}

.primary:hover {
  transform: translateY(-2px);
}

.secondary {
  background: white;
  border: 1px solid #e2e8f0;
}

/* =========================
   FILTROS GENERAL
========================= */

.filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin: 18px 0;
  background: white;
  padding: 12px;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.04);
}

select,
input {
  padding: 10px 12px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  background: #fff;
  font-size: 13px;
  outline: none;
  flex: 1;
  min-width: 150px;
}

/* =========================
   BOTÓN LIMPIAR
========================= */

.clear {
  background: #ef4444;
  color: white;
  border: none;
  border-radius: 12px;
  padding: 10px 14px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
}

.clear:hover {
  transform: scale(1.05);
}

/* =========================
   DATE FILTER (PRO)
========================= */

.date-filter {
  position: relative;
  flex: 1;
  min-width: 240px;
}

/* CHIP PRINCIPAL */
.date-chip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;

  background: linear-gradient(135deg, #ffffff, #f8fafc);
  border: 1px solid #e2e8f0;

  padding: 12px 14px;
  border-radius: 14px;

  cursor: pointer;
  transition: 0.25s ease;

  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.05);
}

.date-chip:hover {
  transform: translateY(-2px);
  border-color: #2563eb;
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.15);
}

.date-chip .icon {
  font-size: 16px;
}

.date-chip .text {
  flex: 1;
  font-size: 13px;
  font-weight: 700;
  color: #0f172a;
}

.date-chip .arrow {
  font-size: 12px;
  color: #64748b;
}

/* DROPDOWN CALENDARIO */
.calendar-popup,
.calendar-dropdown {
  position: absolute;
  top: 110%;
  left: 0;
  width: 100%;
  z-index: 100;

  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);

  border: 1px solid #e2e8f0;
  border-radius: 16px;

  padding: 12px;

  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);

  animation: fadeIn 0.2s ease;
}

/* INPUT CALENDARIO */
.calendar-popup input,
.calendar-dropdown input {
  width: 100%;
  padding: 10px;

  border-radius: 12px;
  border: 1px solid #e2e8f0;

  font-size: 13px;
  outline: none;
}

/* HEADER DROPDOWN */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.calendar-header h4 {
  font-size: 13px;
  font-weight: 800;
  color: #0f172a;
}

.calendar-header button {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #64748b;
}

/* QUICK ACTIONS */
.calendar-actions,
.quick-actions {
  display: flex;
  gap: 6px;
  margin-top: 10px;
}

.calendar-actions button,
.quick-actions button {
  flex: 1;
  padding: 8px;

  font-size: 12px;
  font-weight: 700;

  border: none;
  border-radius: 10px;

  background: #f1f5f9;
  cursor: pointer;

  transition: 0.2s;
}

.calendar-actions button:hover,
.quick-actions button:hover {
  background: #2563eb;
  color: white;
  transform: translateY(-1px);
}

/* =========================
   DATE GROUP
========================= */

.date-group {
  margin-bottom: 30px;
}

.date-header {
  font-size: 14px;
  font-weight: 900;
  color: white;
  background: linear-gradient(135deg, #1e293b, #2563eb);
  padding: 12px 16px;
  border-radius: 14px;
  margin: 18px 0 12px;
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

/* =========================
   GRID
========================= */

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
}

/* =========================
   CARD
========================= */

.card {
  background: white;
  border-radius: 18px;
  padding: 15px;
  border: 1px solid #eef2f7;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  transition: 0.25s;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.08);
}

/* CARD HEADER */
.cardHeader {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #64748b;
  font-weight: 600;
}

/* MATCH */
.match {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
  text-align: center;
  gap: 10px;
}

.team {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.team img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #e2e8f0;
}

.team span {
  font-size: 13px;
  font-weight: 600;
}

/* VS */
.vs {
  font-weight: 900;
  color: #ef4444;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.match-date {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  background: #f1f5f9;
  padding: 4px 8px;
  border-radius: 8px;
}

/* FOOTER */
.footer {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #475569;
  margin-top: 10px;
}

/* EMPTY */
.empty {
  text-align: center;
  margin-top: 30px;
  color: #94a3b8;
  font-weight: 600;
}

/* ANIMACIÓN */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* =========================
   RESPONSIVE
========================= */

@media (max-width: 1024px) {
  .grid {
    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  }
}

@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .actions {
    width: 100%;
    justify-content: flex-start;
  }

  .filters {
    flex-direction: column;
  }

  select,
  input {
    width: 100%;
  }

  .match {
    flex-direction: column;
  }

  .vs {
    flex-direction: row;
    gap: 10px;
  }
}

@media (max-width: 480px) {
  .header h2 {
    font-size: 18px;
  }

  .card {
    padding: 12px;
  }

  .team img {
    width: 40px;
    height: 40px;
  }
}
</style>
