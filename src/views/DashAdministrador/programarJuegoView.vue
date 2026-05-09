<template>
  <div class="admin">
    <!-- TOP BAR -->
    <div class="topbar">
      <h2>⚽ Programación de Partidos</h2>

      <div class="filtersTop">
        <!-- LIGA -->
        <div class="selectBox">
          <span class="label">🏆 Liga</span>
          <select v-model="selected.league">
            <option disabled value="">Selecciona liga</option>
            <option v-for="l in leagues" :key="l.Id" :value="l.Id">
              {{ l.Nombre }}
            </option>
          </select>
        </div>

        <!-- CATEGORÍA -->
        <div class="selectBox">
          <span class="label">📂 Categoría</span>
          <select v-model="selected.category">
            <option disabled value="">Selecciona categoría</option>
            <option v-for="c in categories" :key="c.Id" :value="c.Id">
              {{ c.Nombre }}
            </option>
          </select>
        </div>
      </div>
      <div class="actionsTop">
        <button class="btnDash" @click="goToDashboard">🧭 Dashboard</button>
      </div>
    </div>

    <!-- GRID PRINCIPAL -->
    <div class="grid">
      <!-- LEFT: EQUIPOS -->
      <div class="panel left">
        <h3>⚽ Equipos</h3>

        <div class="slot">
          <button
            :class="{ active: teamSlot === 'home' }"
            @click="teamSlot = 'home'"
          >
            🏠 Local: {{ selected.home?.nombre || "..." }}
          </button>

          <button
            :class="{ active: teamSlot === 'away' }"
            @click="teamSlot = 'away'"
          >
            ✈ Visitante: {{ selected.away?.nombre || "..." }}
          </button>
        </div>

        <div class="teams">
          <div
            v-for="t in filteredTeams"
            :key="t.Id"
            class="teamCard"
            @click="selectTeam(t)"
          >
            ⚽ {{ t.Nombre }}
          </div>
        </div>
      </div>

      <!-- CENTER: CANCHA -->
      <div class="panel center">
        <!-- SCOREBOARD -->
        <div class="scoreboard">
          <span style="color: black">{{
            selected.home?.nombre || "LOCAL"
          }}</span>
          <strong>VS</strong>
          <span>{{ selected.away?.nombre || "VISITA" }}</span>
        </div>

        <!-- CANCHA (NO TOCAR) -->
        <div class="pitch">
          <!-- LIGA + CATEGORÍA -->
          <div class="badgeTop">
            🏆
            {{
              leagues.find((l) => l.Id === selected.league)?.Nombre || "Liga"
            }}
            •
            {{
              categories.find((c) => c.Id === selected.category)?.Nombre ||
              "Categoría"
            }}
          </div>

          <!-- INFO CENTRAL -->
          <div class="line"></div>
          <div class="circle"></div>

          <!-- INFO DINÁMICA -->
          <div class="info">
            🏟 {{ selected.field?.nombre || "Cancha" }} · 👨‍⚖
            {{ selected.referee?.nombre || "Árbitro" }} · 📅
            {{ selected.date || "--" }} · ⏰ {{ selected.time || "--" }}
          </div>
        </div>
      </div>

      <!-- RIGHT: CONFIG -->
      <div class="panel right">
        <h3>⚙ Configuración</h3>

        <select v-model="selected.referee">
          <option disabled>Árbitro</option>
          <option v-for="r in referees" :key="r.id" :value="r">
            {{ r.nombre }}
          </option>
        </select>

        <select v-model="selected.field">
          <option disabled>Cancha</option>
          <option v-for="f in fields" :key="f.id" :value="f">
            {{ f.nombre }}
          </option>
        </select>

        <input type="date" v-model="selected.date" />
        <input type="time" v-model="selected.time" />

        <!-- RESUMEN -->
        <div class="summary">
          <p>📅 {{ selected.date || "Sin fecha" }}</p>
          <p>⏰ {{ selected.time || "Sin hora" }}</p>
        </div>

        <button class="save" @click="saveMatch">💾 Programar Partido</button>
      </div>
    </div>

    <!-- MODAL -->
    <div v-if="modal.show" class="modal-overlay">
      <div class="modal">
        <h3 :class="modal.type">{{ modal.title }}</h3>

        <p>{{ modal.message }}</p>

        <button @click="closeModal">Aceptar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const modal = ref({
  show: false,
  title: "",
  message: "",
  type: "info", // success | error | info
});

const showModal = (title, message, type = "info") => {
  modal.value = {
    show: true,
    title,
    message,
    type,
  };
};

const closeModal = () => {
  modal.value.show = false;
};
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const API =
  "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";
  // "http://192.168.11.28:8080";
  // "http://192.168.100.228:8080";
  
const router = useRouter();

const adminId = ref(null);
const session = JSON.parse(localStorage.getItem("user")) || {};
const defaultLeague = ref(null);
const defaultCategory = ref(null);
/* =======================
   STATE
======================= */
const selected = ref({
  home: null,
  away: null,
  referee: null,
  field: null,
  date: "",
  time: "",
  league: "",
  category: "",
});

const teamSlot = ref("home");

/* =======================
   DATA
======================= */
const leagues = ref([]);
const categories = ref([]);
const teams = ref([]);

const referees = ref([]);

const fields = [
  { id: 1, nombre: "Cancha 1" },
  { id: 2, nombre: "Cancha 2" },
];

/* =======================
   NAV
======================= */
const goBack = () => router.back();
const goToPartidos = () => router.push({ name: "partidosProgramados" });

/* =======================
   LOAD DATA
======================= */
const loadData = async () => {
  try {
    const [l, c, t, a] = await Promise.all([
      axios.get(`${API}/api/ligas`),
      axios.get(`${API}/api/categorias`),
      axios.get(`${API}/api/equipos`),
      axios.get(`${API}/api/arbitros`),
    ]);

    leagues.value = l.data?.data || [];
    categories.value = c.data?.data || [];
    teams.value = t.data?.data || [];

    referees.value = (a.data?.data || []).map((arb) => ({
      id: arb.Id,
      nombre: arb.Nombre,
    }));
  } catch (err) {
    console.log("ERROR LOAD DATA:", err);
  }
};

/* =======================
   SELECT TEAM
======================= */
const selectTeam = (team) => {
  const slot = teamSlot.value;

  if (slot === "home" && selected.value.away?.id === team.Id) return;
  if (slot === "away" && selected.value.home?.id === team.Id) return;

  selected.value[slot] = {
    id: team.Id,
    nombre: team.Nombre,
  };

  teamSlot.value = slot === "home" ? "away" : "home";
};

/* =======================
   FILTER (FIX CRÍTICO)
======================= */
const filteredTeams = computed(() => {
  return teams.value.filter((t) => {
    const ligaOk =
      !selected.value.league || t.Id_Liga === selected.value.league;

    const catOk =
      !selected.value.category || t.Id_Categoria === selected.value.category;

    return ligaOk && catOk;
  });
});

/* =======================
   SAVE MATCH (ROBUSTO)
======================= */
const saveMatch = async () => {
  try {
    const s = selected.value;

    const admin = JSON.parse(localStorage.getItem("user"));

    if (!admin?.Id) {
      showModal("Error", "No hay admin en sesión", "error");
      return;
    }

    adminId.value = admin.Id;

    if (
      !s.home ||
      !s.away ||
      !s.referee ||
      !s.field ||
      !s.date ||
      !s.time ||
      !s.league ||
      !s.category
    ) {
      showModal("Validación", "Completa todos los campos", "info");
      return;
    }

    const payload = {
      Id_Liga: s.league,
      Id_Categoria: s.category,
      Id_Equipo_local: s.home.id,
      Id_Equipo_visitante: s.away.id,
      Id_Arbitro: s.referee.id,
      Id_Cancha: s.field.id,
      Fecha_Juego: s.date,
      Hora_Juego: s.time,
      Responsable_Partido: adminId.value,
    };

    const res = await axios.post(`${API}/api/partidos`, payload);

    if (res.data?.ok) {
      showModal("Éxito", "Partido guardado correctamente", "success");

      // 🔥 SOLO LIMPIAR PARTIDO, NO FILTROS
      selected.value.home = null;
      selected.value.away = null;
      selected.value.referee = null;
      selected.value.field = null;
      selected.value.date = "";
      selected.value.time = "";

      // ❌ IMPORTANTE: NO tocar league ni category
      // selected.value.league = ""
      // selected.value.category = ""
    }
  } catch (err) {
    console.log("ERROR FRONT:", err.response?.data || err);
    showModal("Error", "Error al guardar partido", "error");
  }
};

const goToDashboard = () => {
  router.push({ name: "DashAdministrador" });
};

onMounted(() => {
  loadData();

  const admin = JSON.parse(localStorage.getItem("admin"));
  adminId.value = admin?.Id || null;
});
</script>

<style scoped>
/* =========================
   MODAL
========================= */

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  backdrop-filter: blur(6px);
}

.modal {
  background: white;
  padding: 25px;
  border-radius: 16px;
  width: 320px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
  animation: pop 0.2s ease;
}

.modal h3 {
  margin-bottom: 10px;
  font-size: 18px;
}

.modal p {
  font-size: 14px;
  color: #475569;
  margin-bottom: 20px;
}

.modal button {
  padding: 10px 16px;
  border: none;
  border-radius: 10px;
  background: #0f172a;
  color: white;
  cursor: pointer;
  font-weight: 600;
}

/* TIPOS */
.modal h3.success {
  color: #16a34a;
}

.modal h3.error {
  color: #dc2626;
}

.modal h3.info {
  color: #2563eb;
}

/* ANIMACIÓN */
@keyframes pop {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
/* =========================
   SELECTORS PREMIUM (LIGA / CATEGORÍA)
========================= */

.filtersTop {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
  align-items: center;
}

/* contenedor tipo card pequeña */
.selectBox {
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 10px 12px;
  min-width: 200px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.06);
  transition: 0.25s;
}

.selectBox:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(37, 99, 235, 0.12);
  border-color: #c7d2fe;
}

/* label elegante */
.label {
  font-size: 11px;
  font-weight: 700;
  color: #64748b;
  margin-bottom: 6px;
  letter-spacing: 0.3px;
}

/* select moderno */
.selectBox select {
  border: none;
  outline: none;
  font-weight: 600;
  color: #0f172a;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
}

/* icono visual en focus */
.selectBox:focus-within {
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
}
.actionsTop {
  display: flex;
  align-items: center;
}

.btnDash {
  background: linear-gradient(135deg, #6366f1, #2563eb);
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 12px;
  font-weight: 700;
  cursor: pointer;
  transition: 0.2s;
  box-shadow: 0 6px 15px rgba(37, 99, 235, 0.25);
}

.btnDash:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}
.admin {
  min-height: 100vh;
  background: #f8fafc;
  padding: 20px;
  font-family: Inter, system-ui, sans-serif;
  color: #0f172a;
}

/* =========================
   TOPBAR (LIGA + CATEGORÍA DESTACADOS)
========================= */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 15px;
}

.topbar h2 {
  font-size: 22px;
  font-weight: 800;
}

/* CHIPS LIGA / CATEGORÍA */
.filtersTop {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.chip {
  display: flex;
  flex-direction: column;
  background: #0f172a;
  padding: 8px 12px;
  border-radius: 12px;
  color: white;
  min-width: 170px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
  transition: 0.2s;
}

.chip:hover {
  transform: translateY(-2px);
}

.chip label {
  font-size: 11px;
  opacity: 0.7;
  margin-bottom: 4px;
}

.chip select {
  background: white;
  color: #0f172a;
  border: none;
  border-radius: 8px;
  padding: 6px;
  font-weight: 600;
  cursor: pointer;
}

/* =========================
   GRID PRINCIPAL
========================= */
.grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: 15px;
}

/* responsive */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
  }
}

/* =========================
   PANELES
========================= */
.panel {
  background: white;
  border-radius: 16px;
  padding: 15px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 15px rgba(15, 23, 42, 0.05);
}

.panel h3 {
  font-size: 16px;
  font-weight: 700;
  margin-bottom: 10px;
}

/* =========================
   EQUIPOS
========================= */
.slot {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 10px;
}

.slot button {
  padding: 10px;
  border-radius: 10px;
  border: none;
  background: #e2e8f0;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

.slot button:hover {
  background: #cbd5e1;
}

.slot .active {
  background: #0f172a;
  color: white;
}

.teams {
  max-height: 420px;
  overflow-y: auto;
  padding-right: 5px;
}

.teamCard {
  padding: 10px;
  border-radius: 10px;
  margin-bottom: 8px;
  cursor: pointer;
  background: #f1f5f9;
  transition: 0.2s;
  font-weight: 600;
}

.teamCard:hover {
  background: #dbeafe;
  transform: translateX(3px);
}

/* =========================
   CANCHA (NO ALTERADA FUNCIONALMENTE)
========================= */
.center {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.scoreboard {
  display: flex;
  justify-content: space-between;
  font-weight: 700;
  margin-bottom: 10px;
  font-size: 14px;
  color: #334155;
}

.scoreboard strong {
  font-size: 16px;
  color: #0f172a;
}

/* CANCHA */
.pitch {
  height: 380px;
  background: linear-gradient(135deg, #1f6f3f, #2f8f4e);
  border-radius: 16px;
  position: relative;
  overflow: hidden;
  box-shadow: inset 0 0 30px rgba(0, 0, 0, 0.25);
}

/* línea central */
.line {
  position: absolute;
  left: 50%;
  width: 2px;
  height: 100%;
  background: rgba(255, 255, 255, 0.85);
}

/* círculo central */
.circle {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 90px;
  height: 90px;
  border: 2px solid rgba(255, 255, 255, 0.85);
  border-radius: 50%;
  transform: translate(-50%, -50%);
}

/* INFO ABAJO */
.info {
  position: absolute;
  bottom: 12px;
  left: 50%;
  transform: translateX(-50%);
  background: white;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 12px;
  font-weight: 600;
  color: #0f172a;
}

/* BADGE LIGA + CATEGORÍA */
.badgeTop {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.35);
  color: white;
  padding: 6px 14px;
  border-radius: 999px;
  font-size: 12px;
  backdrop-filter: blur(6px);
  font-weight: 600;
}

/* =========================
   CONFIG
========================= */
.right select,
.right input {
  width: 100%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: white;
  transition: 0.2s;
}

.right select:focus,
.right input:focus {
  border-color: #2563eb;
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.15);
  outline: none;
}

/* RESUMEN */
.summary {
  background: #f8fafc;
  border-radius: 12px;
  padding: 10px;
  margin: 10px 0;
  font-size: 13px;
  color: #475569;
  font-weight: 500;
}

/* BOTÓN GUARDAR */
.save {
  width: 100%;
  padding: 12px;
  background: #0f172a;
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
  transition: 0.2s;
}

.save:hover {
  background: #1e293b;
  transform: translateY(-2px);
}

.save:active {
  transform: scale(0.98);
}

/* =========================
   SCROLLBAR PRO
========================= */
.teams::-webkit-scrollbar {
  width: 6px;
}

.teams::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}

.teams::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}
</style>
