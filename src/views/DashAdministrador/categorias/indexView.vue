<template>
  <div class="page">
    <!-- HEADER -->
    <div class="top-bar">
      <h1>⚽ Categorías por Liga</h1>

      <button @click="goToCreate">
        ➕ Nueva Categoría
      </button>
      <button @click="goToHome">
        ➕ Casa
      </button>
      
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="loading">
      Cargando categorías...
    </div>

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
          <div
            v-for="cat in categorias"
            :key="cat.Id"
            class="categoria"
          >
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

const API = "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";

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
  router.push({ name: "dashAdministrador" });
};

onMounted(fetchCategorias);
</script>

<style scoped>
/* 🌌 PAGE */
.page {
  min-height: 100vh;
  padding: 30px;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  color: white;
  font-family: "Segoe UI", sans-serif;
}

/* 🔝 HEADER */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.top-bar h1 {
  font-size: 28px;
  font-weight: bold;
}

.top-bar button {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  border: none;
  padding: 12px 18px;
  border-radius: 12px;
  color: white;
  cursor: pointer;
  font-weight: bold;
  transition: 0.3s;
}

.top-bar button:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(99, 102, 241, 0.6);
}

/* 📦 GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

/* 🧊 CARD LIGA */
.liga-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 20px;
  border: 1px solid rgba(255,255,255,0.1);
  transition: 0.3s;
}

.liga-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 25px rgba(99, 102, 241, 0.3);
}

/* 🧠 HEADER LIGA */
.liga-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 15px;
}

.liga-header h2 {
  font-size: 18px;
  color: #c7d2fe;
}

.liga-header span {
  font-size: 12px;
  opacity: 0.7;
}

/* 📊 CATEGORIAS */
.categorias {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 🔹 ITEM */
.categoria {
  background: #1e293b;
  padding: 12px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.2s;
}

.categoria:hover {
  background: #334155;
}

/* 🏷️ STATUS */
.activo {
  color: #22c55e;
}

.inactivo {
  color: #ef4444;
}

/* ⏳ LOADING */
.loading {
  text-align: center;
  margin-top: 40px;
}

/* ❌ ERROR */
.error {
  margin-top: 20px;
  color: #f87171;
  text-align: center;
}

/* 📱 RESPONSIVE */
@media (max-width: 600px) {
  .top-bar {
    flex-direction: column;
    gap: 10px;
  }

  .top-bar h1 {
    font-size: 22px;
  }
}
</style>