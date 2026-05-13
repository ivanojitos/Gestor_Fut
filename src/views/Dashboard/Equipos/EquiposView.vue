<template>
  <div class="page">
    <!-- 🔥 HEADER -->
    <div class="header">
      <h1>🏆 Tabla de Competencia</h1>
      <p>Visualiza el rendimiento de equipos y jugadores</p>
    </div>

    <!-- 🔥 LIGAS (NAV TIPO PILLS) -->
    <!-- <div class="league-nav">
      <div
        v-for="liga in ligas"
        :key="liga.Id"
        @click="selectLiga(liga)"
        :class="['league-pill', selectedLiga?.Id === liga.Id && 'active']"
      >
        {{ liga.Nombre }}
      </div>
    </div>

     🔥 CATEGORÍAS 
    <div v-if="selectedLiga" class="categories">
      <div
        v-for="cat in categorias"
        :key="cat.Id"
        @click="selectedCategoria = cat"
        :class="['cat-pill', selectedCategoria?.Id === cat.Id && 'active']"
      >
        {{ cat.Nombre }}
      </div>
    </div>  -->

    <!-- 🔥 EMPTY -->
    <div v-if="!currentData" class="empty">⚽ Selecciona una categoría</div>

    <template v-if="currentData">
      <!-- 🔥 PODIO TOP 3 -->
      <div class="podium">
        <div class="place second" v-if="currentData.teams[1]">
          <img :src="currentData.teams[1].logo" />
          <p>{{ currentData.teams[1].name }}</p>
          <span>{{ currentData.teams[1].points }} pts</span>
        </div>

        <div class="place first">
          <img :src="currentData.teams[0].logo" />
          <p>{{ currentData.teams[0].name }}</p>
          <span>{{ currentData.teams[0].points }} pts</span>
        </div>

        <div class="place third" v-if="currentData.teams[2]">
          <img :src="currentData.teams[2].logo" />
          <p>{{ currentData.teams[2].name }}</p>
          <span>{{ currentData.teams[2].points }} pts</span>
        </div>
      </div>

      <!-- 🔥 PREMIOS -->
      <!-- <div class="awards">
        MVP
        <div class="award glass" v-if="currentData.mvp">
          <h3>⭐ MVP</h3>
          <img :src="currentData.mvp.photo" />
          <p>{{ currentData.mvp.name }}</p>
        </div>

        GOLEADOR
        <div class="award glass" v-if="currentData.scorer">
          <h3>⚽ Goleador</h3>
          <img :src="currentData.scorer.photo" />
          <p>{{ currentData.scorer.name }}</p>
          <span>{{ currentData.scorer.goals }} goles</span>
        </div>

        PORTERO
        <div class="award glass" v-if="currentData.keeper">
          <h3>🧤 Portero</h3>
          <img :src="currentData.keeper.photo" />
          <p>{{ currentData.keeper.name }}</p>
        </div>
      </div> -->

      <!-- 🔥 TABLA MODERNA -->
      <!-- 🔥 TABLA MODERNA -->
      <div class="table">
        <!-- HEADER -->
        <div class="table-header">
          <span>#</span>
          <span>Equipo</span>
          <span>PJ</span>
          <span>PG</span>
          <span>PP</span>
          <span>GF</span>
          <span>GC</span>
          <span>DIF</span>
          <span>PTS</span>
        </div>

        <!-- ROWS -->
        <div
          class="row"
          v-for="(team, index) in currentData.teams"
          :key="team.id"
          @click="goToEquipo(team, index)"
          :data-pj="team.played"
          :data-pg="team.wins"
          :data-pp="team.losses"
          :data-gf="team.gf"
          :data-gc="team.gc"
          :data-dif="team.difference"
          :data-pts="team.points"
        >
          <div class="rank">
            {{ index + 1 }}
          </div>

          <div class="team">
            <img :src="team.logo" />
            <span>{{ team.name }}</span>
          </div>
          <div class="stat">
            {{ team.played }}
          </div>
          <div class="stat">
            {{ team.wins }}
          </div>

          <div class="stat">
            {{ team.losses }}
          </div>

          <div class="stat">
            {{ team.gf }}
          </div>

          <div class="stat">
            {{ team.gc }}
          </div>

          <div
            class="stat diff"
            :class="{
              positive: team.difference > 0,
              negative: team.difference < 0,
            }"
          >
            {{ team.difference > 0 ? "+" : "" }}{{ team.difference }}
          </div>

          <div class="points">
            {{ team.points }}
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRouter } from "vue-router";
import axios from "axios";

const API =
   "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";
  // "http://192.168.11.28:8080";
  // "http://192.168.100.228:8080";

const router = useRouter();
const tabla = ref(null);
const user = JSON.parse(localStorage.getItem("user"));

const goToEquipo = (team, index) => {
  router.push({
    name: "EquipoDetalle1",
    params: {
      id: team.id,
    },
    query: {
      position: index + 1,
    },
  });
};

const fetchTabla = async () => {
  try {
    const resEquipo = await axios.get(`${API}/api/equipos/jugador/${user.Id}`);

    const equipo = resEquipo.data.data?.[0];

    const res = await axios.get(`${API}/api/tabla`, {
      params: {
        Id_Liga: user.Id_Liga,
        Id_Categoria: equipo.Id_Categoria,
      },
    });

    const data = res.data.data;

    // 🔥 ordenar equipos
    const teamsSorted = data.teams
      .map((t) => ({
        id: Number(t.Id),
        name: t.Nombre,
        logo: encodeURI(API + t.Logo),

        wins: Number(t.PG) || 0,
        losses: Number(t.PP) || 0,

        played: (Number(t.PG) || 0) + (Number(t.PP) || 0),

        gf: Number(t.GF) || 0,
        gc: Number(t.GC) || 0,

        difference: Number(t.Diferencia) || 0,

        points: Number(t.PTS) || 0,
      }))
      .sort((a, b) => {
        if (b.points !== a.points) {
          return b.points - a.points;
        }

        if (b.difference !== a.difference) {
          return b.difference - a.difference;
        }

        if (b.gf !== a.gf) {
          return b.gf - a.gf;
        }

        if (a.played !== b.played) {
          return a.played - b.played;
        }

        return a.losses - b.losses;
      });

    // 🔥 ACTUALIZAR POSICIONES EN DB
    for (let i = 0; i < teamsSorted.length; i++) {
      const team = teamsSorted[i];

      await axios.put(`${API}/api/equipos/${team.id}/posicion`, {
        Posicion: i + 1,
      });
    }

    // 🔥 guardar tabla
    tabla.value = {
      teams: teamsSorted,
    };
  } catch (err) {
    console.error("ERROR TABLA:", err);
  }
};
const currentData = computed(() => tabla.value);

onMounted(fetchTabla);
</script>

<style scoped>
.table {
  width: 100%;
  max-width: 1200px;

  margin: 0 auto;

  display: flex;
  flex-direction: column;
  gap: 14px;
}
/* =========================
   TABLE HEADER
========================= */
.table-header {
  display: grid;
  grid-template-columns:
    70px
    minmax(220px, 1fr)
    repeat(7, 70px)
    90px;

  align-items: center;

  padding: 14px 20px;
  margin-bottom: 10px;

  border-radius: 18px;

  background: rgba(15, 23, 42, 0.92);

  color: white;

  font-size: 13px;
  font-weight: 800;
  letter-spacing: 0.5px;

  backdrop-filter: blur(10px);
}

/* =========================
   ROW NUEVO
========================= */
.row {
  position: relative;

  display: grid;

  grid-template-columns:
    60px
    minmax(180px, 1fr)
    repeat(7, 70px)
    70px;

  align-items: center;

  gap: 10px;

  padding: 16px 20px;

  border-radius: 22px;

  background: rgba(255, 255, 255, 0.78);

  backdrop-filter: blur(10px);

  border: 1px solid rgba(255, 255, 255, 0.7);

  box-shadow:
    0 8px 25px rgba(0, 0, 0, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);

  transition: 0.25s ease;

  cursor: pointer;

  overflow: hidden;
}

.row::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;

  width: 6px;
  height: 100%;

  background: linear-gradient(180deg, #22c55e, #16a34a);
}

.row:hover {
  transform: translateX(6px);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

/* =========================
   STATS
========================= */
.stat {
  text-align: center;
  font-weight: 800;
  color: #334155;
  font-size: 14px;
}

.points {
  text-align: center;

  font-size: 18px;
  font-weight: 900;

  color: #16a34a;
}

/* DIFERENCIA */
.diff.positive {
  color: #16a34a;
}

.diff.negative {
  color: #ef4444;
}

/* TEAM */
.team {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.team img {
  width: 56px;
  height: 56px;

  object-fit: cover;

  border-radius: 50%;

  background: white;
  padding: 4px;

  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.team span {
  font-weight: 800;
  font-size: 15px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* RANK */
.rank {
  width: 52px;
  height: 52px;

  border-radius: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(135deg, #22c55e, #16a34a);

  color: white;

  font-size: 20px;
  font-weight: 900;

  box-shadow: 0 8px 18px rgba(34, 197, 94, 0.25);
}

/* =========================
   TABLET
========================= */
@media (max-width: 1024px) {
  .table-header,
  .row {
    grid-template-columns:
      70px
      minmax(220px, 1fr)
      repeat(7, 70px)
      90px;
  }

  .team img {
    width: 48px;
    height: 48px;
  }

  .team span {
    font-size: 14px;
  }
}

/* =========================
   MOBILE
========================= */
@media (max-width: 768px) {
  .table {
    gap: 14px;
  }

  .table-header {
    display: none;
  }

  .row {
    grid-template-columns: 55px 1fr auto;

    padding: 14px;
    gap: 12px;
  }

  .rank {
    width: 45px;
    height: 45px;
    font-size: 16px;
  }

  .team {
    gap: 10px;
  }

  .team img {
    width: 46px;
    height: 46px;
  }

  .team span {
    font-size: 14px;
  }

  .stat,
  .points {
    display: none;
  }

  /* MOBILE EXTRA INFO */
  .row::after {
    content: "PJ: " attr(data-pj) " | PG: " attr(data-pg) " | PP: "
      attr(data-pp) " | GF: " attr(data-gf) " | GC: " attr(data-gc) " | DIF: "
      attr(data-dif) " | PTS: " attr(data-pts);

    grid-column: span 3;

    margin-top: 6px;

    font-size: 12px;
    font-weight: 700;

    color: #64748b;
  }
}
.page {
  min-height: 100vh;
  padding: 28px;
  background:
    radial-gradient(
      circle at top right,
      rgba(34, 197, 94, 0.08),
      transparent 25%
    ),
    radial-gradient(
      circle at bottom left,
      rgba(59, 130, 246, 0.08),
      transparent 25%
    ),
    linear-gradient(135deg, #f8fafc, #eef2ff);
  font-family: "Inter", sans-serif;
  color: #0f172a;
  overflow-x: hidden;
}

/* =========================
   HEADER
========================= */
.header {
  margin-bottom: 28px;
  position: relative;
  z-index: 2;
}

.header h1 {
  font-size: 38px;
  font-weight: 900;
  letter-spacing: -1px;
  margin-bottom: 6px;
  color: #0f172a;
}

.header p {
  color: #64748b;
  font-size: 15px;
  max-width: 500px;
  line-height: 1.5;
}

/* =========================
   LIGAS NAV
========================= */
.league-nav {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding-bottom: 10px;
  margin-bottom: 20px;
  scrollbar-width: none;
}

.league-nav::-webkit-scrollbar {
  display: none;
}

.league-pill {
  padding: 12px 20px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(226, 232, 240, 0.8);
  cursor: pointer;
  font-weight: 700;
  white-space: nowrap;
  transition: 0.25s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.04);
  backdrop-filter: blur(8px);
}

.league-pill:hover {
  transform: translateY(-2px);
  background: white;
}

.league-pill.active {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  border: none;
  box-shadow: 0 10px 20px rgba(34, 197, 94, 0.25);
}

/* =========================
   CATEGORIAS
========================= */
.categories {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  margin-bottom: 25px;
  padding-bottom: 5px;
  scrollbar-width: none;
}

.categories::-webkit-scrollbar {
  display: none;
}

.cat-pill {
  padding: 10px 18px;
  border-radius: 999px;
  background: white;
  border: 1px solid #e2e8f0;
  cursor: pointer;
  font-size: 13px;
  font-weight: 700;
  transition: 0.25s;
  white-space: nowrap;
}

.cat-pill:hover {
  transform: scale(1.04);
}

.cat-pill.active {
  background: #0f172a;
  color: white;
  border-color: #0f172a;
}

/* =========================
   EMPTY
========================= */
.empty {
  margin-top: 80px;
  text-align: center;
  color: #94a3b8;
  font-size: 18px;
  font-weight: 600;
}

/* =========================
   PODIO
========================= */
.podium {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 25px;
  margin: 40px 0;
  flex-wrap: wrap;
}

.place {
  position: relative;
  width: 180px;
  min-height: 220px;
  border-radius: 28px;
  padding: 22px;
  text-align: center;
  overflow: hidden;
  transition: 0.35s;
  backdrop-filter: blur(10px);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
}

.place::before {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(255, 255, 255, 0.4);
  z-index: 0;
}

.place * {
  position: relative;
  z-index: 2;
}

.place img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 50%;
  margin-bottom: 12px;
  border: 4px solid rgba(255, 255, 255, 0.7);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.place p {
  font-weight: 800;
  font-size: 16px;
  margin-bottom: 5px;
}

.place span {
  font-size: 13px;
  opacity: 0.9;
}

.place:hover {
  transform: translateY(-8px);
}

/* FIRST */
.place.first {
  transform: scale(1.1);
  background: linear-gradient(135deg, #facc15, #f59e0b);
  color: white;
}

.place.first::after {
  content: "👑";
  position: absolute;
  top: 10px;
  right: 14px;
  font-size: 24px;
}

/* SECOND */
.place.second {
  background: linear-gradient(135deg, #ffffff, #dbeafe);
}

/* THIRD */
.place.third {
  background: linear-gradient(135deg, #fecaca, #f87171);
  color: white;
}

/* =========================
   AWARDS
========================= */
.awards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 35px;
}

.award {
  position: relative;
  overflow: hidden;
  border-radius: 26px;
  padding: 28px 20px;
  text-align: center;
  transition: 0.3s;
  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
}

.award::before {
  content: "";
  position: absolute;
  width: 160px;
  height: 160px;
  background: rgba(34, 197, 94, 0.08);
  border-radius: 50%;
  top: -80px;
  right: -80px;
}

.award:hover {
  transform: translateY(-6px);
}

.award h3 {
  font-size: 20px;
  margin-bottom: 12px;
  font-weight: 900;
}

.award img {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 14px;
  border: 4px solid white;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.award p {
  font-weight: 800;
  margin-bottom: 5px;
}

.award span {
  color: #16a34a;
  font-weight: 700;
}

.row::before {
  content: "";
  position: absolute;
  left: 0;
  top: 0;
  width: 6px;
  height: 100%;
  background: linear-gradient(180deg, #22c55e, #16a34a);
}

.row:hover {
  transform: translateX(6px);
  box-shadow:
    0 12px 30px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
}

.rank {
  width: 52px;
  height: 52px;
  border-radius: 16px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: linear-gradient(135deg, #22c55e, #16a34a);

  color: white;
  font-size: 20px;
  font-weight: 900;

  box-shadow: 0 8px 18px rgba(34, 197, 94, 0.25);
}

.team {
  display: flex;
  align-items: center;
  gap: 14px;
  min-width: 0;
}

.team img {
  width: 58px;
  height: 58px;
  object-fit: cover;
  border-radius: 50%;
  background: white;
  padding: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.team span {
  font-weight: 800;
  font-size: 16px;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.stats {
  text-align: right;
}

.stats span {
  display: block;
  font-size: 18px;
  font-weight: 900;
  color: #16a34a;
}

.stats small {
  color: #64748b;
  font-size: 12px;
}

/* =========================
   TABLET
========================= */
@media (max-width: 1024px) {
  .page {
    padding: 22px;
  }

  .header h1 {
    font-size: 32px;
  }

  .awards {
    grid-template-columns: repeat(2, 1fr);
  }

  .podium {
    gap: 18px;
  }

  .place {
    width: 160px;
  }

  .row {
    grid-template-columns:
      60px
      minmax(180px, 1fr)
      repeat(5, 60px)
      70px;
  }

  .team img {
    width: 50px;
    height: 50px;
  }
}

/* =========================
   CELULAR
========================= */
@media (max-width: 768px) {
  .page {
    padding: 16px;
  }

  .header {
    text-align: center;
  }

  .header h1 {
    font-size: 28px;
    line-height: 1.1;
  }

  .header p {
    font-size: 14px;
    margin: auto;
  }

  .league-pill,
  .cat-pill {
    font-size: 13px;
    padding: 10px 15px;
  }

  /* PODIO MOBILE */
  .podium {
    flex-direction: column;
    align-items: center;
    margin-top: 20px;
  }

  .place,
  .place.first {
    width: 100%;
    max-width: 320px;
    transform: none;
  }

  .place:hover {
    transform: translateY(-4px);
  }

  /* AWARDS */
  .awards {
    grid-template-columns: 1fr;
  }

  .award {
    padding: 24px 18px;
  }

  .award img {
    width: 80px;
    height: 80px;
  }

  /* TABLE */
  .row {
    grid-template-columns: 55px 1fr;
    gap: 12px;
    padding: 14px;
  }

  .stats {
    grid-column: span 2;
    text-align: left;
    padding-left: 68px;
    margin-top: -5px;
  }

  .stats span {
    font-size: 16px;
  }

  .team span {
    font-size: 14px;
  }

  .team img {
    width: 46px;
    height: 46px;
  }

  .rank {
    width: 45px;
    height: 45px;
    font-size: 17px;
  }
}

/* =========================
   CELULARES PEQUEÑOS
========================= */
@media (max-width: 480px) {
  .page {
    padding: 12px;
  }

  .header h1 {
    font-size: 24px;
  }

  .header p {
    font-size: 13px;
  }

  .place {
    min-height: auto;
    padding: 20px;
  }

  .place img {
    width: 70px;
    height: 70px;
  }

  .award h3 {
    font-size: 18px;
  }

  .award img {
    width: 72px;
    height: 72px;
  }

  .row {
    padding: 12px;
    border-radius: 18px;
  }

  .team {
    gap: 10px;
  }

  .team span {
    max-width: 140px;
  }

  .stats {
    padding-left: 56px;
  }

  .stats small {
    font-size: 11px;
  }
}
</style>
