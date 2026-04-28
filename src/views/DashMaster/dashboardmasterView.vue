<template>
  <div class="leagues">
    <!-- HEADER -->
    <div class="header">
      <h1>🏆 Mis Ligas</h1>
      <button class="createBtn" @click="goCreate">+ Nueva Liga</button>
    </div>

    <!-- GRID -->
    <div class="grid">
      <div v-for="liga in ligas" :key="liga.Id" class="card">
        <!-- LOGO -->
        <img :src="getLogo(liga.Logo)" class="logo" />

        <!-- INFO -->
        <div class="info">
          <h2>{{ liga.Nombre }}</h2>
          <p class="cat">⚽ Liga deportiva</p>
          <div class="details">
            <span>📍 {{ liga.Direccion }}</span>
            <span>📞 {{ liga.Celular }}</span>
          </div>
        </div>

        <!-- STATUS -->
        <div
          class="status"
          :class="liga.Estatus === 'Activo' ? 'active' : 'inactive'"
        >
          {{ liga.Estatus }}
        </div>

        <!-- ACTIONS -->
        <div class="actions">
          <button class="edit" @click="editLiga(liga)">✏️</button>
          <button class="delete" @click="deleteLiga(liga.Id)">🗑</button>
        </div>
      </div>
    </div>

    <!-- EMPTY -->
    <div v-if="ligas.length === 0" class="empty">
      <p>No hay ligas registradas 😢</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const ligas = ref([]);
const defaultLogo = "https://via.placeholder.com/100";

const fetchLigas = async () => {
  try {
    const res = await axios.get(
      "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net/api/ligas",
    );

    console.log("RESPUESTA:", res.data); // 👈 DEBUG

    ligas.value = res.data.data || []; // 🔥 AQUÍ ESTÁ LA CLAVE
  } catch (error) {
    console.error("Error cargando ligas", error);
  }
};

const getLogo = (logo) => {
  if (!logo) return defaultLogo;

  return `https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net${logo}`;
};

const goCreate = () => {
  router.push("/dashboard/crearLiga"); // master
};

const editLiga = (liga) => {
  alert("Editar " + liga.Nombre);
};

const deleteLiga = async (id) => {
  if (!confirm("¿Eliminar liga?")) return;

  try {
    await axios.delete(
      `https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net/api/ligas/${id}`,
    );
    ligas.value = ligas.value.filter((l) => l.Id !== id);
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchLigas);
</script>

<style scoped>
.leagues {
  padding: 20px;
  background: linear-gradient(180deg, #f8fafc, #e2e8f0);
  min-height: 100vh;
  font-family: "Inter", sans-serif;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.header h1 {
  font-size: 22px;
  font-weight: 700;
  color: #0f172a;
}

.createBtn {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

.createBtn:hover {
  transform: scale(1.05);
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 18px;
}

/* CARD */
.card {
  background: white;
  border-radius: 18px;
  padding: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  position: relative;
  transition: 0.25s;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
}

/* LOGO */
.logo {
  width: 70px;
  height: 70px;
  object-fit: cover;
  border-radius: 12px;
  margin-bottom: 10px;
}

/* INFO */
.info h2 {
  font-size: 16px;
  margin: 0;
  color: #0f172a;
}

.cat {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0;
}

.details {
  font-size: 12px;
  color: #475569;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

/* STATUS */
.status {
  position: absolute;
  top: 10px;
  right: 10px;
  padding: 4px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 600;
}

.active {
  background: #dcfce7;
  color: #166534;
}

.inactive {
  background: #fee2e2;
  color: #991b1b;
}

/* ACTIONS */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
  margin-top: 10px;
}

.actions button {
  border: none;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: 0.2s;
}

.edit {
  background: #e0f2fe;
}
.edit:hover {
  background: #0284c7;
  color: white;
}

.delete {
  background: #fee2e2;
}
.delete:hover {
  background: #ef4444;
  color: white;
}

/* EMPTY */
.empty {
  text-align: center;
  margin-top: 40px;
  color: #64748b;
}

/* 📱 RESPONSIVE */
@media (max-width: 600px) {
  .header {
    flex-direction: column;
    gap: 10px;
  }

  .createBtn {
    width: 100%;
  }
}
</style>
