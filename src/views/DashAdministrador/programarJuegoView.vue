<template>
  <div class="roles">
    <!-- HEADER -->
    <div class="header">
      <div>
        <h1>
          ⚽ Generador Automático de Roles

          <span v-if="isOdd" class="imparBadge"> ⚠️ Equipos impares </span>
        </h1>

        <p>Genera automáticamente partidos equilibrados por liga y categoría</p>

        <div v-if="isOdd" class="imparOption">
          <label>
            <input type="checkbox" v-model="form.jugarTodos" />
            Permitir que todos los equipos jueguen (un equipo jugará 2 veces)
          </label>
        </div>
      </div>

      <button class="backBtn" @click="goDashboard">🧭 Dashboard</button>
    </div>

    <!-- CONFIG -->
    <div class="configCard">
      <h2>⚙ Configuración del Rol</h2>

      <div class="grid">
        <div class="field">
          <label>🏆 Liga</label>
          <select v-model="form.liga">
            <option disabled value="">Selecciona liga</option>
            <option v-for="l in leagues" :key="l.Id" :value="l.Id">
              {{ l.Nombre }}
            </option>
          </select>
        </div>

        <div class="field">
          <label>📂 Categoría</label>
          <select v-model="form.categoria">
            <option disabled value="">Selecciona categoría</option>
            <option v-for="c in categories" :key="c.Id" :value="c.Id">
              {{ c.Nombre }}
            </option>
          </select>
        </div>

        <div class="field">
          <label>📅 Fecha Inicial</label>
          <input type="date" v-model="form.fechaInicio" />
        </div>

        <div class="field">
          <label>📅 Fecha Final</label>
          <input type="date" v-model="form.fechaFin" />
        </div>

        <div class="field">
          <label>🕐 Hora Inicial</label>
          <input type="time" v-model="form.horaInicio" />
        </div>

        <div class="field">
          <label>🕐 Hora Final</label>
          <input type="time" v-model="form.horaFin" />
        </div>

        <div class="field">
          <label>⏱ Duración Partido</label>
          <select v-model="form.duracion">
            <option :value="60">60 min</option>
            <option :value="70">70 min</option>
            <option :value="90">90 min</option>
          </select>
        </div>

        <div class="field">
          <label>📆 Días Permitidos</label>

          <div class="days">
            <button
              v-for="d in dias"
              :key="d.value"
              :class="{ active: form.dias.includes(d.value) }"
              @click="toggleDay(d.value)"
            >
              {{ d.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- CANCHAS -->
      <div class="canchas">
        <h3>🏟 Canchas Disponibles</h3>

        <div class="canchaList">
          <button
            v-for="f in fields"
            :key="f.id"
            :class="{ active: form.canchas.includes(f.id) }"
            @click="toggleCancha(f.id)"
          >
            {{ f.nombre }}
          </button>
        </div>
      </div>

      <!-- GENERAR -->
      <div class="actions">
        <button type="button" class="generateBtn" @click="generateRole">
          ⚡ Generar Rol
        </button>
      </div>
    </div>

    <!-- EQUIPOS -->
    <div v-if="filteredTeams.length" class="teamsCard">
      <div class="teamsHeader">
        <h2>⚽ Equipos Encontrados</h2>
        <span>{{ filteredTeams.length }} equipos</span>
      </div>

      <div class="teamsGrid">
        <div v-for="team in filteredTeams" :key="team.Id" class="teamItem">
          <div class="teamName">⚽ {{ team.Nombre }}</div>
          <small>PJ: {{ team.PJ || 0 }}</small>
        </div>
      </div>
    </div>

    <!-- PREVIEW -->
    <div v-if="preview.length" class="previewCard">
      <div class="previewHeader">
        <div>
          <h2>📋 Preview del Rol</h2>
          <p>{{ preview.length }} partidos generados</p>
        </div>

        <button type="button" class="confirmBtn" @click="confirmRole">
          ✅ Confirmar Rol
        </button>
      </div>

      <div class="tableWrapper">
        <table>
          <thead>
            <tr>
              <th>#</th>
              <th>Local</th>
              <th>Visitante</th>
              <th>Fecha</th>
              <th>Hora</th>
              <th>Árbitro</th>
              <th>Cancha</th>
              <th>Estado</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="(m, index) in preview" :key="index">
              <td>{{ index + 1 }}</td>
              <td class="team">🏠 {{ m.local }}</td>
              <td class="team">✈ {{ m.visitante }}</td>
              <td>{{ m.fecha }}</td>
              <td>{{ m.hora }}</td>
              <td>{{ m.arbitro }}</td>
              <td>{{ m.cancha }}</td>
              <td>
                <span class="status previewStatus">PREVIEW</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const API =
   "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";
  // "http://192.168.11.28:8080";
  // "http://192.168.100.228:8080";

/* =========================
   DATA
========================= */

const leagues = ref([]);
const categories = ref([]);
const teams = ref([]);
const referees = ref([]);

const nextAvailableDate = ref(null);

const fields = ref([
  { id: 1, nombre: "Cancha 1" },
  { id: 2, nombre: "Cancha 2" },
]);

const dias = [
  { label: "L", value: 1 },
  { label: "M", value: 2 },
  { label: "X", value: 3 },
  { label: "J", value: 4 },
  { label: "V", value: 5 },
  { label: "S", value: 6 },
  { label: "D", value: 0 },
];

const form = ref({
  liga: "",
  categoria: "",
  fechaInicio: "",
  fechaFin: "",
  horaInicio: "07:00",
  horaFin: "12:00",
  duracion: 60,
  dias: [6],
  canchas: [1, 2],
  jugarTodos: false,
});

const preview = ref([]);

/* =========================
   BLOQUEO 3 DÍAS
========================= */

const canGenerate = computed(() => {
  if (!nextAvailableDate.value) return true;

  const now = new Date();
  const limit = new Date(nextAvailableDate.value);

  return now >= limit;
});

/* =========================
   TEAMS FILTER
========================= */

const filteredTeams = computed(() => {
  return teams.value.filter((t) => {
    const ligaOk =
      !form.value.liga || Number(t.Id_Liga) === Number(form.value.liga);

    const categoriaOk =
      !form.value.categoria ||
      Number(t.Id_Categoria) === Number(form.value.categoria);

    return ligaOk && categoriaOk;
  });
});

const isOdd = computed(() => filteredTeams.value.length % 2 !== 0);

/* =========================
   LOAD DATA
========================= */

const loadData = async () => {
  try {
    const [resLigas, resCategorias, resEquipos, resArbitros] =
      await Promise.all([
        axios.get(`${API}/api/ligas`),
        axios.get(`${API}/api/categorias`),
        axios.get(`${API}/api/equipos`),
        axios.get(`${API}/api/arbitros`),
      ]);

    leagues.value = resLigas.data.data || [];
    categories.value = resCategorias.data.data || [];
    teams.value = resEquipos.data.data || [];
    referees.value = resArbitros.data.data || [];
  } catch (error) {
    console.log(error);
  }
};

const toggleDay = (day) => {
  const exists = form.value.dias.includes(day);

  if (exists) {
    form.value.dias = form.value.dias.filter((d) => d !== day);
  } else {
    form.value.dias.push(day);
  }
};

const toggleCancha = (id) => {
  const exists = form.value.canchas.includes(id);

  if (exists) {
    form.value.canchas = form.value.canchas.filter((c) => c !== id);
  } else {
    form.value.canchas.push(id);
  }
};

const goDashboard = () => {
  router.push("dashAdministrador");
};

/* =========================
   GENERAR ROL (CORREGIDO)
========================= */

const checkExistingRole = async () => {
  try {
    const res = await axios.get(`${API}/api/partidos/existe`, {
      params: {
        liga: form.value.liga,
        categoria: form.value.categoria,
        fechaInicio: form.value.fechaInicio,
        fechaFin: form.value.fechaFin,
      },
    });

    return res.data.exists;
  } catch (error) {
    console.log(error);
    return false;
  }
};

const generateRole = async () => {
  console.log("CLICK GENERAR");

  if (!canGenerate.value) {
    alert("⛔ No puedes generar otro rol todavía.");
    return;
  }

  if (!form.value.liga || !form.value.categoria) {
    alert("Selecciona liga y categoría");
    return;
  }

  if (
    !form.value.fechaInicio ||
    !form.value.fechaFin ||
    !form.value.horaInicio ||
    !form.value.horaFin
  ) {
    alert("Completa fechas y horarios");
    return;
  }

  try {
    const exists = await checkExistingRole();

    if (exists) {
      alert("⚠️ Ya existe un rol programado");
      return;
    }

    let equipos = [...filteredTeams.value];

    if (equipos.length < 2) {
      alert("No hay suficientes equipos");
      return;
    }

    let partidos = [];

    let fechaActual = form.value.fechaInicio;
    let horaActual = form.value.horaInicio;

    let canchaIndex = 0;
    let arbitroIndex = 0;

    // SI HAY IMPARES
    if (equipos.length % 2 !== 0 && form.value.jugarTodos) {
      const randomIndex = Math.floor(Math.random() * equipos.length);

      equipos.push({
        ...equipos[randomIndex],
      });
    }

    for (let i = 0; i < equipos.length; i += 2) {
      const local = equipos[i];
      const visitante = equipos[i + 1];

      if (!visitante) break;

      const inicio = toMinutes(horaActual);
      const fin = toMinutes(form.value.horaFin);

      if (inicio >= fin) {
        alert("⛔ Ya no hay más horarios disponibles");
        break;
      }

      // ÁRBITRO
      const arbitro =
        referees.value.length > 0
          ? referees.value[
              arbitroIndex % referees.value.length
            ]
          : null;

      // CANCHA
      const cancha = fields.value[canchaIndex];

      partidos.push({
        // IDs IMPORTANTES
        Id_Liga: form.value.liga,
        Id_Categoria: form.value.categoria,

        Id_Equipo_local: local.Id,
        Id_Equipo_visitante: visitante.Id,

        Id_Arbitro: arbitro?.Id || null,
        Id_Cancha: cancha?.id || null,

        // DISPLAY
        local: local.Nombre,
        visitante: visitante.Nombre,

        arbitro: arbitro?.Nombre || "Pendiente",
        cancha: cancha?.nombre || "Cancha",

        fecha: fechaActual,
        hora: horaActual,

        estado: "PREVIEW",
      });

      arbitroIndex++;
      canchaIndex =
        (canchaIndex + 1) % fields.value.length;

      // SUMAR TIEMPO
      const [h, m] = horaActual.split(":");

      const date = new Date();

      date.setHours(h);
      date.setMinutes(m);

      date.setMinutes(
        date.getMinutes() + form.value.duracion,
      );

      horaActual = date
        .toTimeString()
        .slice(0, 5);
    }

    preview.value = partidos;

    console.log("PREVIEW FINAL:", preview.value);

    if (!preview.value.length) {
      alert("No se pudieron generar partidos");
    }
  } catch (error) {
    console.log(error);
    alert("Error generando rol");
  }
};

/* =========================
   CONFIRMAR ROL
========================= */
const toMinutes = (time) => {
  if (!time || !time.includes(":")) return 0;

  const [h, m] = time.split(":").map(Number);

  return h * 60 + m;
};

const confirmRole = async () => {
  try {
    console.log('entro uno');
    
    if (!preview.value.length) {
      alert("No hay partidos para guardar");
      return;
    }

    console.log('entro dos');
    const exists = await checkExistingRole();

    if (exists) {
      alert("⚠️ Ya existe un rol programado");
      return;
    }

     console.log('entro tres');
    const payload = preview.value.map((p) => ({
      Id_Liga: Number(p.Id_Liga),
      Id_Categoria: Number(p.Id_Categoria),

      Id_Equipo_local: Number(p.Id_Equipo_local),
      Id_Equipo_visitante: Number(p.Id_Equipo_visitante),

      Id_Arbitro: Number(p.Id_Arbitro),
      Id_Cancha: Number(p.Id_Cancha),

      Fecha_Juego: p.fecha,
      Hora_Juego: p.hora,

      Responsable_Partido: "ADMIN",
    }));

    console.log(
      "🔥 PAYLOAD FINAL:",
      JSON.stringify(payload, null, 2),
    );

    for (const partido of payload) {
      const res = await axios.post(
        `${API}/api/partidos`,
        partido,
      );

      console.log("✅ GUARDADO:", res.data);
    }

    const lastMatch =
      preview.value[preview.value.length - 1];

    const limitDate = new Date(
      `${lastMatch.fecha}T${lastMatch.hora}`,
    );

    limitDate.setDate(limitDate.getDate() + 3);

    nextAvailableDate.value =
      limitDate.toISOString();

    localStorage.setItem(
      "nextRoleDate",
      limitDate.toISOString(),
    );

    alert("✅ Rol guardado correctamente");

    preview.value = [];
  } catch (error) {
    console.log(error);

    console.log(
      "❌ ERROR BACKEND:",
      error.response?.data,
    );

    alert(
      error.response?.data?.message ||
        "Error guardando rol",
    );
  }
};

/* =========================
   INIT
========================= */

onMounted(() => {
  loadData();

  const saved = localStorage.getItem("nextRoleDate");

  if (saved) {
    const date = new Date(saved);
    if (!isNaN(date.getTime())) {
      nextAvailableDate.value = date.toISOString();
    }
  }
});
</script>

<style scoped>
.imparBadge {
  display: inline-block;
  margin-left: 12px;
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 999px;
  background: #fff7ed;
  color: #c2410c;
  font-weight: 800;
  vertical-align: middle;
}

.imparOption {
  margin-top: 8px;
  font-size: 13px;
  color: #475569;
}

.imparOption input {
  margin-right: 6px;
}
/* =========================
   EQUIPOS
========================= */

.teamsCard {
  background: white;
  border-radius: 24px;
  padding: 24px;
  margin-bottom: 24px;

  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
}

.teamsHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 18px;
}

.teamsHeader h2 {
  font-size: 22px;
  font-weight: 800;
}

.teamsHeader span {
  background: #dbeafe;
  color: #1d4ed8;

  padding: 6px 12px;
  border-radius: 999px;

  font-size: 12px;
  font-weight: 800;
}

.teamsGrid {
  display: grid;

  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));

  gap: 14px;
}

.teamItem {
  border: 1px solid #e2e8f0;

  border-radius: 16px;

  padding: 16px;

  background: #f8fafc;

  transition: 0.2s ease;
}

.teamItem:hover {
  transform: translateY(-2px);

  box-shadow: 0 8px 20px rgba(15, 23, 42, 0.06);
}

.teamName {
  font-weight: 800;

  margin-bottom: 6px;
}
.roles {
  min-height: 100vh;
  background: #f8fafc;
  padding: 24px;
  font-family: Inter, sans-serif;
  color: #0f172a;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  gap: 20px;
  flex-wrap: wrap;
}

.header h1 {
  font-size: 32px;
  font-weight: 900;
}

.header p {
  margin-top: 6px;
  color: #64748b;
  font-size: 14px;
}

.backBtn {
  border: none;
  background: #0f172a;
  color: white;
  padding: 12px 18px;
  border-radius: 14px;
  cursor: pointer;
  font-weight: 700;
}

/* CARD */
.configCard,
.previewCard {
  background: white;
  border-radius: 24px;
  padding: 24px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.06);
  margin-bottom: 24px;
}

.configCard h2,
.previewCard h2 {
  font-size: 22px;
  margin-bottom: 20px;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 18px;
}

.field {
  display: flex;
  flex-direction: column;
}

.field label {
  font-size: 13px;
  font-weight: 700;
  margin-bottom: 8px;
  color: #475569;
}

.field input,
.field select {
  height: 48px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  padding: 0 14px;
  font-size: 14px;
  outline: none;
}

/* DAYS */
.days {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.days button,
.canchaList button {
  border: none;
  background: #e2e8f0;
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 700;
}

.days .active,
.canchaList .active {
  background: #2563eb;
  color: white;
}

/* CANCHAS */
.canchas {
  margin-top: 24px;
}

.canchaList {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-top: 10px;
}

/* ACTIONS */
.actions {
  margin-top: 28px;
  display: flex;
  justify-content: flex-end;
}

.generateBtn,
.confirmBtn {
  border: none;
  border-radius: 16px;
  padding: 14px 22px;
  font-weight: 800;
  cursor: pointer;
  color: white;
}

.generateBtn {
  background: linear-gradient(135deg, #2563eb, #1d4ed8);
}

.confirmBtn {
  background: linear-gradient(135deg, #16a34a, #15803d);
}

/* PREVIEW */
.previewHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  gap: 20px;
  flex-wrap: wrap;
}

.previewHeader p {
  color: #64748b;
  font-size: 14px;
}

.tableWrapper {
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f1f5f9;
}

th,
td {
  padding: 14px;
  text-align: left;
  border-bottom: 1px solid #e2e8f0;
  font-size: 14px;
}

.team {
  font-weight: 700;
}

.status {
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 800;
}

.previewStatus {
  background: #dbeafe;
  color: #1d4ed8;
}

/* MOBILE */
@media (max-width: 768px) {
  .roles {
    padding: 14px;
  }

  .header h1 {
    font-size: 24px;
  }

  .configCard,
  .previewCard {
    padding: 18px;
  }

  .oddWarning {
    margin: 10px 0 20px;
    padding: 12px;
    background: #fff7ed;
    border: 1px solid #fed7aa;
    border-radius: 12px;
    font-size: 13px;
  }
}
</style>
