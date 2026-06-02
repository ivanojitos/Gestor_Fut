<template>
  <div class="page">
    <!-- STATS -->
    <section class="stats">
      <div class="stat-card">
        <div class="stat-icon">👤</div>
        <h3>1,250+</h3>
        <p>Jugadores Registrados</p>
      </div>

      <div class="stat-card">
        <div class="stat-icon">🏆</div>
        <h3>120</h3>
        <p>Equipos Activos</p>
      </div>

      <div class="stat-card">
        <div class="stat-icon">⚽</div>
        <h3>35</h3>
        <p>Ligas Disponibles</p>
      </div>
    </section>

    <!-- FILTROS -->
    <section class="filters">
      <div class="filter-group">
        <label>Posición</label>
        <select>
          <option>Todas</option>
          <option>Portero</option>
          <option>Defensa</option>
          <option>Mediocampista</option>
          <option>Delantero</option>
        </select>
      </div>

      <div class="filter-group">
        <label>Edad</label>
        <select>
          <option>Todas</option>
          <option>18 - 21</option>
          <option>22 - 25</option>
          <option>26 - 30</option>
        </select>
      </div>

      <div class="filter-group">
        <label>País</label>
        <select>
          <option>Todos</option>
        </select>
      </div>

      <button class="filter-btn">Aplicar Filtros</button>
    </section>

    <!-- TITULO -->
    <section class="section-title">
      <div>
        <h2>Jugadores Disponibles</h2>
        <p>Explora los perfiles y encuentra al candidato ideal.</p>
      </div>

      <div class="results">{{ players.length }} resultados</div>
    </section>

    <!-- GRID -->
    <section class="players-grid">
      <div v-for="player in players" :key="player.id" class="player-card">
        <!-- HEADER CARD -->
        <div class="card-banner">
          <div class="rating-circle">
            {{ player.numero }}
          </div>
        </div>

        <!-- FOTO -->
        <div class="avatar-wrapper">
          <div class="avatar-ring">
            <img
              v-if="player.photo"
              :src="player.photo"
              class="player-avatar"
              @error="(e) => console.log('Error imagen:', e.target.src)"
            />

            <img
              v-else
              src="https://ui-avatars.com/api/?name=Jugador"
              class="player-avatar"
            />
          </div>
        </div>

        <!-- BODY -->
        <div class="player-body">
          <div class="status-row">
            <span class="available"> Disponible </span>
          </div>

          <h3>
            {{ player.name }}
          </h3>

          <p class="position">
            {{ player.position }}
          </p>

          <!-- STATS -->
          <div class="stats-box">
            <div class="stat">
              <strong>{{ player.age }}</strong>
              <span>Edad</span>
            </div>

            <div class="divider"></div>

            <div class="stat">
              <strong>{{ player.height }}</strong>
              <span>Altura</span>
            </div>

            <div class="divider"></div>

            <div class="stat">
              <strong>{{ player.position }}</strong>
              <span>Pie</span>
            </div>
          </div>

          <!-- TEAM -->
          <div class="team-box">
            <div>
              <small>Equipo</small>
              <strong>{{ player.team }}</strong>
            </div>

            <div>
              <small>Estado</small>
              <strong class="free">
                {{ player.team.includes("Libre") ? "Libre" : "Activo" }}
              </strong>
            </div>
          </div>

          <!-- CTA -->
          <button class="view-btn">Ver Perfil Completo</button>
        </div>
      </div>
    </section>
  </div>
  <div v-if="loading" class="text-center py-10">Cargando jugadores...</div>

  <div v-if="error" class="text-red-500 text-center">
    {{ error }}
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const API =
  "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";
// "http://192.168.11.217:8080";

const players = ref([]);
const loading = ref(false);
const error = ref(null);

const equiposMap = ref({});

/* =========================
   CARGAR EQUIPOS (MAPA)
========================= */
const loadEquipos = async () => {
  try {
    const res = await axios.get(`${API}/api/equipos`);

    const equipos = res.data?.data || res.data;

    equipos.forEach((e) => {
      equiposMap.value[e.Id] = e.NombreEquipo;
    });
  } catch (err) {
    console.error("Error cargando equipos:", err);
  }
};

/* =========================
   CARGAR JUGADORES
========================= */
const getPlayers = async () => {
  try {
    loading.value = true;

    // Primero aseguras equipos cargados
    await loadEquipos();

    const res = await axios.get(`${API}/api/jugadores`);

    const data = res.data?.data || res.data;

    console.log("Respuesta API:", data);

    players.value = data.map((p) => ({
      id: p.Id,
      name: p.NombreCompleto?.trim(),
      age: Number(p.Edad),
      position: p.Posicion?.trim(),
      height: p.Estatura
        ? `${(parseFloat(p.Estatura) / 100).toFixed(2)} m`
        : "N/A",
      photo: p.Foto ? `${API}${p.Foto.trim()}` : null,

      team:
        p.Id_Equipo === 0
          ? "Agente Libre"
          : equiposMap.value[p.Id_Equipo] || "Equipo desconocido",

      rating: p.NumCampeonatos ?? 0,
      email: p.Correo?.trim(),
      status: p.Estatus?.trim(),
      numero: p.Numero ?? "N/A",
    }));
  } catch (err) {
    error.value = "Error al cargar jugadores";
    console.error(err);
  } finally {
    loading.value = false;
  }
};

/* =========================
   ON MOUNTED
========================= */
onMounted(() => {
  getPlayers();
});
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.page {
  min-height: 100vh;
  background: #ffffff;
}

/* HERO */

.hero {
  padding: 80px 20px 50px;

  background:
    radial-gradient(circle at top right, #dbeafe 0%, transparent 25%),
    radial-gradient(circle at bottom left, #eff6ff 0%, transparent 25%), white;
}

.hero-content {
  max-width: 900px;
  margin: auto;
  text-align: center;
}

.hero-badge {
  display: inline-block;

  padding: 10px 18px;

  background: #eff6ff;
  color: #2563eb;

  border-radius: 999px;

  font-weight: 700;
}

.hero h1 {
  margin-top: 25px;

  font-size: clamp(2.5rem, 6vw, 5rem);

  line-height: 1.05;

  font-weight: 900;

  color: #0f172a;
}

.hero h1 span {
  color: #2563eb;
}

.hero p {
  margin-top: 20px;

  color: #64748b;

  font-size: 1.1rem;
}

.hero-search {
  margin-top: 35px;

  display: flex;
  justify-content: center;
  gap: 12px;
}

.hero-search input {
  width: 550px;
  max-width: 100%;

  height: 60px;

  border-radius: 18px;

  border: 1px solid #e5e7eb;

  padding: 0 20px;

  font-size: 15px;
}

.hero-search button {
  border: none;

  background: #2563eb;

  color: white;

  border-radius: 18px;

  padding: 0 30px;

  font-weight: 700;

  cursor: pointer;
}

/* STATS */

.stats {
  max-width: 1200px;

  margin: 0 auto;

  padding: 0 20px;

  display: grid;
  grid-template-columns: repeat(3, 1fr);

  gap: 20px;
}

.stat-card {
  background: white;

  border-radius: 24px;

  padding: 30px;

  text-align: center;

  border: 1px solid #e5e7eb;

  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.05);
}

.stat-icon {
  font-size: 30px;
  margin-bottom: 10px;
}

.stat-card h3 {
  font-size: 2rem;
  color: #2563eb;
}

.stat-card p {
  color: #64748b;
}

/* FILTROS */

.filters {
  max-width: 1200px;

  margin: 50px auto;

  padding: 24px;

  display: grid;
  grid-template-columns: repeat(4, 1fr);

  gap: 15px;

  background: white;

  border: 1px solid #e5e7eb;

  border-radius: 24px;

  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.04);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  font-size: 13px;
  font-weight: 700;
  color: #64748b;
}

.filter-group select {
  height: 55px;

  border-radius: 14px;

  border: 1px solid #e5e7eb;

  padding: 0 15px;
}

.filter-btn {
  border: none;

  border-radius: 14px;

  background: #2563eb;

  color: white;

  font-weight: 800;

  cursor: pointer;
}

/* TITULO */

.section-title {
  max-width: 1400px;

  margin: 0 auto 30px;

  padding: 0 20px;

  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title h2 {
  font-size: 2rem;
  font-weight: 900;
}

.section-title p {
  color: #64748b;
}

.results {
  background: #eff6ff;

  color: #2563eb;

  padding: 10px 16px;

  border-radius: 999px;

  font-weight: 700;
}

/* GRID */

.players-grid {
  max-width: 1400px;

  margin: auto;

  padding: 0 20px 80px;

  display: grid;

  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));

  gap: 30px;
}

.player-card {
  background: white;

  border-radius: 30px;

  overflow: hidden;

  border: 1px solid #e5e7eb;

  transition: 0.35s;

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

.player-card:hover {
  transform: translateY(-10px);

  box-shadow: 0 35px 70px rgba(37, 99, 235, 0.12);
}

.player-card:hover .avatar-ring {
  transform: scale(1.08);
  box-shadow:
    0 0 0 8px white,
    0 20px 45px rgba(37, 99, 235, 0.4),
    0 0 50px rgba(96, 165, 250, 0.55);
}

.player-avatar {
  width: 100%;
  height: 100%;

  border-radius: 50%;

  object-fit: cover;

  display: block;

  background: #f8fafc;
}

.card-banner {
  height: 150px;

  background:
    radial-gradient(
      circle at top right,
      rgba(255, 255, 255, 0.25),
      transparent 35%
    ),
    linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #60a5fa 100%);

  position: relative;
}

.rating-circle {
  position: absolute;

  right: 18px;
  top: 18px;

  width: 60px;
  height: 60px;

  border-radius: 50%;

  background: rgba(255, 255, 255, 0.95);

  backdrop-filter: blur(10px);

  color: #2563eb;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 20px;
  font-weight: 900;

  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
}

.avatar-wrapper {
  display: flex;
  justify-content: center;
  margin-top: -72px;
  position: relative;
  z-index: 20;
}



.player-body {
  padding: 25px;
}

.status-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.available {
  background: #dcfce7;
  color: #15803d;

  padding: 6px 12px;

  border-radius: 999px;

  font-size: 12px;

  font-weight: 700;
}

.country {
  color: #64748b;
  font-weight: 600;
}

.player-body h3 {
  margin-top: 18px;

  text-align: center;

  font-size: 24px;

  font-weight: 900;
}

.position {
  text-align: center;

  color: #64748b;

  margin-top: 5px;
}

.stats-box {
  margin-top: 25px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background: #f8fafc;

  border-radius: 18px;

  padding: 18px;
}

.stat {
  flex: 1;
  text-align: center;
}

.stat strong {
  display: block;
  font-size: 20px;
}

.stat span {
  font-size: 12px;
  color: #64748b;
}

.divider {
  width: 1px;
  height: 40px;
  background: #e5e7eb;
}

.team-box {
  margin-top: 20px;

  display: flex;
  justify-content: space-between;

  background: #f8fafc;

  border-radius: 18px;

  padding: 16px;
}

.team-box small {
  display: block;
  color: #64748b;
}

.team-box strong {
  color: #0f172a;
}

.free {
  color: #16a34a;
}

.view-btn {
  width: 100%;

  height: 55px;

  margin-top: 22px;

  border: none;

  border-radius: 16px;

  background: linear-gradient(135deg, #2563eb, #1d4ed8);

  color: white;

  font-weight: 800;

  cursor: pointer;
}

.view-btn:hover {
  box-shadow: 0 15px 35px rgba(37, 99, 235, 0.25);
}

/* RESPONSIVE */

@media (max-width: 900px) {
  .filters {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 768px) {
  .hero-search {
    flex-direction: column;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .section-title {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .filters {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .players-grid {
    grid-template-columns: 1fr;
  }

  .player-card {
    border-radius: 24px;
  }

  .hero {
    padding: 60px 20px 40px;
  }
}

.avatar-ring {
  width: 145px;
  height: 145px;
  padding: 4px;

  border-radius: 50%;

  background: linear-gradient(135deg, #60a5fa, #2563eb, #1d4ed8);

  box-shadow:
    0 0 0 8px white,
    0 15px 35px rgba(37, 99, 235, 0.25),
    0 0 40px rgba(96, 165, 250, 0.35);

  overflow: hidden;

  transition: all 0.35s ease;
}
</style>
