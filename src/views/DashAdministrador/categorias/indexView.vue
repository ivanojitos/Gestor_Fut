<template>
  <div class="page">
    <!-- HEADER -->
    <div class="top-bar">
      <h1>⚽ Categorías por Liga</h1>

      <button @click="goToCreate">➕ Nueva Categoría</button>
      <button @click="goToHome">Inicio</button>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="loading">Cargando categorías...</div>

    <!-- CONTENIDO -->
    <div v-else class="grid">
      <div
        v-for="(categorias, liga) in agrupadas"
        :key="liga"
        class="liga-card"
      >
        <!-- HEADER LIGA -->
        <div class="liga-header">
          <h2>{{ liga }}</h2>
          <span>{{ categorias.length }} categorías</span>
        </div>

        <!-- CATEGORIAS -->
        <div class="categorias">
          <div v-for="cat in categorias" :key="cat.Id" class="categoria">
            <h3>{{ cat.Nombre }}</h3>
            <p :class="cat.Estatus">
              {{ cat.Estatus }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- ERROR -->
    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const API =
  "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";
// "http://192.168.11.28:8080";
// "http://192.168.100.228:8080";

const router = useRouter();

const categorias = ref([]);
const loading = ref(true);
const error = ref("");

// 🔥 AGRUPAR POR LIGA
const agrupadas = computed(() => {
  return categorias.value.reduce((acc, cat) => {
    const liga = cat.Liga;

    if (!acc[liga]) {
      acc[liga] = [];
    }

    acc[liga].push(cat);

    return acc;
  }, {});
});

// 🔽 FETCH
const fetchCategorias = async () => {
  try {
    const res = await axios.get(`${API}/api/categorias`);

    categorias.value = res.data.data;
  } catch (err) {
    error.value = "Error cargando categorías";
  } finally {
    loading.value = false;
  }
};

// 🔽 NAV
const goToCreate = () => {
  router.push({ name: "CategoriasCreate" }); // 👈 ajusta el nombre
};

const goToHome = () => {
  router.push({ name: "DashAdministrador" });
};

onMounted(fetchCategorias);
</script>

<style scoped>
/* 🌍 FONDO BLANCO PREMIUM */
.page {
  min-height: 100vh;
  padding: 30px;
  background: #f8fafc;
  font-family: "Segoe UI", sans-serif;
  color: #0f172a;
}

/* 🔝 TOP BAR MODERNA */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 25px;
}

.top-bar h1 {
  font-size: 24px;
  font-weight: 900;
  color: #0f172a;
}

/* BOTONES HEADER */
.top-bar button {
  background: linear-gradient(135deg, #2563eb, #3b82f6);
  border: none;
  padding: 10px 14px;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  font-weight: 700;
  transition: 0.25s;
  box-shadow: 0 10px 20px rgba(37, 99, 235, 0.15);
}

.top-bar button:hover {
  transform: translateY(-2px);
}

/* 📦 GRID RESPONSIVE */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
}

/* 💎 CARD LIGA MODERNA */
.liga-card {
  background: white;
  border-radius: 18px;
  padding: 18px;
  border: 1px solid #eef2f7;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  transition: 0.25s;
}

.liga-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 35px rgba(0, 0, 0, 0.08);
}

/* 🧠 HEADER LIGA */
.liga-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.liga-header h2 {
  font-size: 16px;
  font-weight: 800;
  color: #1e293b;
}

.liga-header span {
  font-size: 12px;
  background: #eff6ff;
  color: #2563eb;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: 600;
}

/* 📊 LISTA CATEGORÍAS */
.categorias {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 🔹 ITEM */
.categoria {
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.2s;
  border: 1px solid #eef2f7;
}

.categoria:hover {
  background: #f1f5f9;
  transform: scale(1.02);
}

.categoria h3 {
  font-size: 14px;
  font-weight: 700;
}

/* 🏷️ STATUS */
.activo {
  color: #16a34a;
  font-weight: 700;
  font-size: 12px;
  background: #dcfce7;
  padding: 4px 10px;
  border-radius: 999px;
}

.inactivo {
  color: #ef4444;
  font-weight: 700;
  font-size: 12px;
  background: #fee2e2;
  padding: 4px 10px;
  border-radius: 999px;
}

/* ⏳ LOADING */
.loading {
  text-align: center;
  margin-top: 50px;
  color: #64748b;
  font-weight: 600;
}

/* ❌ ERROR */
.error {
  margin-top: 20px;
  color: #ef4444;
  text-align: center;
  font-weight: 600;
}

/* ✨ ANIMACIÓN */
.liga-card {
  animation: fadeIn 0.4s ease;
}

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

/* 📱 TABLET */
@media (max-width: 768px) {
  .top-bar {
    flex-direction: column;
    align-items: flex-start;
  }

  .top-bar h1 {
    font-size: 20px;
  }

  .grid {
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  }
}

/* 📱 CELULAR */
@media (max-width: 480px) {
  .page {
    padding: 15px;
  }

  .liga-header h2 {
    font-size: 14px;
  }

  .categoria h3 {
    font-size: 13px;
  }
}
</style>
