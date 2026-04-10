<template>
  <div class="container">
    <h2 class="title">🏟️ Ligas disponibles</h2>
    <p class="subtitle">Selecciona una liga para ver su información</p>

    <!-- 🔹 LISTA DE LIGAS -->
    <div class="ligas-grid">
      <div
        v-for="liga in ligas"
        :key="liga.name"
        class="liga-card"
        :class="{ active: selectedLiga?.name === liga.name }"
        @click="selectedLiga = liga"
      >
        <img :src="liga.logo" class="liga-logo" />
        <p class="liga-name">{{ liga.name }}</p>
      </div>
    </div>

    <!-- 🔹 INFO LIGA -->
    <div v-if="selectedLiga" class="liga-detail">
      <div class="liga-grid">
        <!-- 🔹 IZQUIERDA -->
        <div class="liga-main">
          <div class="header">
            <img :src="selectedLiga.logo" />
            <div>
              <h3>{{ selectedLiga.name }}</h3>
              <p class="level">{{ selectedLiga.level }}</p>
            </div>
          </div>

          <!-- ⭐ ESTRELLAS -->
          <div class="stars">
            <span v-for="n in 5" :key="n">
              {{ n <= selectedLiga.stars ? "⭐" : "☆" }}
            </span>
          </div>

          <!-- 📊 NIVEL VISUAL -->
          <div class="level-bar">
            <div
              class="level-fill"
              :style="{ width: selectedLiga.stars * 20 + '%' }"
            ></div>
          </div>

          <!-- INFO -->
          <div class="info">
            <p><strong>📍 Dirección:</strong> {{ selectedLiga.address }}</p>
            <p><strong>⚽ Nivel:</strong> {{ selectedLiga.level }}</p>
          </div>
        </div>

        <!-- 🔹 DERECHA -->
        <div class="liga-side">
          <!-- CATEGORÍAS -->
          <div class="card-box">
            <p class="cat-title">Categorías</p>
            <div class="tags">
              <span v-for="cat in selectedLiga.categories" :key="cat">
                {{ cat }}
              </span>
            </div>
          </div>

          <!-- 🔥 EXTRA INFO -->
          <div class="card-box stats">
            <p class="cat-title">Datos de liga</p>

            <div class="stat">
              <span>👥 Equipos</span>
              <strong>{{ selectedLiga.teams || 12 }}</strong>
            </div>

            <div class="stat">
              <span>⚽ Partidos</span>
              <strong>{{ selectedLiga.matches || 30 }}</strong>
            </div>

            <div class="stat">
              <span>🏆 Nivel</span>
              <strong>{{ selectedLiga.level }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const selectedLiga = ref(null);

const ligas = [
  {
    name: "Liga Zavaleta",
    logo: "https://lh5.googleusercontent.com/proxy/M9DUX4X_cXCyxacyvAH9TATsf8umSA4D7Vv74zYHmljA7pODwGSNVIE3vTSEG3K9rL8lywNyHtSXQcZrwYGqUyE28g71ot_hgN7iQ8VZLkBh10BfnkTbaobi",
    stars: 4,
    level: "Alto",
    address: "Zavaleta, Puebla",
    categories: ["Libre", "Sub-20", "Veteranos"],
  },
  {
    name: "Xpert Fut 7",
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTbQb1BGG3k6gGMCN8jtwxkNffbz1mJRuLxfQ&s",
    stars: 5,
    level: "Profesional",
    address: "Cholula, Puebla",
    categories: ["Primera", "Segunda"],
  },
  {
    name: "Liga Amalucan",
    logo: "https://images.cdn-files-a.com/uploads/1713888/800_5c09a8d8e2c10.png",
    stars: 3,
    level: "Medio",
    address: "Amalucan, Puebla",
    categories: ["Libre", "Juvenil"],
  },
  {
    name: "Liga Bosques",
    logo: "https://refereeprocm.s3.amazonaws.com/categories/65c2c594e4b0b10961b8ccf7/65c2c594e4b0b10961b8ccf7.55",
    stars: 4,
    level: "Competitivo",
    address: "Bosques de San Sebastián",
    categories: ["Libre", "Femenil"],
  },
];
</script>

<style scoped>
/* 🔥 GRID PRINCIPAL */
.liga-grid {
  display: grid;
  grid-template-columns: 2fr 1fr; /* 🔥 magia aquí */
  gap: 20px;
}

/* IZQUIERDA */
.liga-main {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* DERECHA */
.liga-side {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* TARJETAS */
.card-box {
  background: #f8fafc;
  border-radius: 14px;
  padding: 15px;
  border: 1px solid #e2e8f0;
}

/* STATS */
.stat {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  color: #1e293b;
}

/* 🔥 BARRA NIVEL */
.level-bar {
  width: 100%;
  height: 8px;
  background: #e5e7eb;
  border-radius: 999px;
  overflow: hidden;
}

.level-fill {
  height: 100%;
  background: linear-gradient(90deg, #22c55e, #4ade80);
  border-radius: 999px;
  transition: 0.3s;
}
.container {
  padding: 30px;
  background: #f1f5f9; /* 🔥 gris más visible */
  min-height: 100vh;
}

/* TITULOS */
.title {
  font-size: 26px;
  font-weight: 700;
  color: #0f172a; /* 🔥 oscuro real */
}

.subtitle {
  color: #334155; /* 🔥 más contraste */
  margin-bottom: 20px;
}

/* GRID LIGAS */
.ligas-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  margin-bottom: 25px;
}

/* CARD LIGA */
.liga-card {
  background: #ffffff;
  border-radius: 16px;
  padding: 15px;
  text-align: center;
  border: 1px solid #cbd5e1; /* 🔥 borde más visible */
  cursor: pointer;
  transition: 0.25s;
}

.liga-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.liga-card.active {
  border: 2px solid #22c55e;
  background: #ecfdf5;
}

/* LOGO */
.liga-logo {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  margin-bottom: 10px;
}

/* NOMBRE */
.liga-name {
  font-weight: 600;
  font-size: 14px;
  color: #0f172a; /* 🔥 IMPORTANTE */
}

/* DETALLE */
.liga-detail {
  background: #ffffff;
  border-radius: 20px;
  padding: 20px;
  border: 1px solid #cbd5e1;
}

/* HEADER */
.header {
  display: flex;
  align-items: center;
  gap: 15px;
}

.header h3 {
  color: #020617; /* 🔥 negro fuerte */
}

.header img {
  width: 70px;
  height: 70px;
  border-radius: 50%;
}

.level {
  color: #475569; /* 🔥 gris visible */
}

/* ESTRELLAS */
.stars {
  font-size: 22px;
  margin: 10px 0;
}

/* INFO */
.info {
  margin: 10px 0;
  color: #010102;
}

/* CATEGORIAS */
.categories {
  margin-top: 15px;
}

.cat-title {
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
}

.tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.tags span {
  background: #e0f2fe;
  color: #0369a1;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
}

/* ANIMACION */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
