<template>
  <div class="admins">
    <!-- HEADER -->
    <div class="header">
      <div>
        <h1>👤 Administradores</h1>
        <p class="subtitle">Gestión de usuarios administradores</p>
      </div>

      <button class="btn-create" @click="goCreate">
        + Nuevo Administrador
      </button>
    </div>

    <!-- TABLE -->
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Teléfono</th>
            <th>Estatus</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="admin in admins" :key="admin.Id">
            <td>{{ admin.Nombre }}</td>
            <td>{{ admin.Correo }}</td>
            <td>{{ admin.Celular }}</td>

            <td>
              <span
                class="status"
                :class="admin.Estatus === 'Activo' ? 'active' : 'inactive'"
              >
                {{ admin.Estatus }}
              </span>
            </td>

            <td class="actions">
              <button class="edit" @click="editAdmin(admin)">✏️</button>
              <button class="delete" @click="deleteAdmin(admin.Id)">🗑</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- EMPTY -->
    <div v-if="admins.length === 0" class="empty">
      <p>No hay administradores registrados 😢</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();
const admins = ref([]);

const API =
  "https://back-node-gestor-fut-hbggakfghgaqe3cs.westeurope-01.azurewebsites.net";
// "http://192.168.11.28:8080";
// "http://192.168.100.228:8080";

// 🔥 GET ADMINISTRADORES
const fetchAdmins = async () => {
  try {
    const res = await axios.get(`${API}/api/admins`);

    console.log("ADMINS:", res.data);

    if (res.data.ok) {
      admins.value = res.data.data;
    }
  } catch (error) {
    console.error("Error cargando admins", error);
  }
};

// 🚀 NAVIGATE CREATE
const goCreate = () => {
  router.push({ name: "dashboardMasterCreate" });
};

// ✏️ EDIT
const editAdmin = (admin) => {
  alert("Editar " + admin.Nombre);
};

// 🗑 DELETE
const deleteAdmin = async (id) => {
  if (!confirm("¿Eliminar administrador?")) return;

  try {
    await axios.delete(`${API}/api/admins/${id}`);
    admins.value = admins.value.filter((a) => a.Id !== id);
  } catch (error) {
    console.error(error);
  }
};

onMounted(fetchAdmins);
</script>

<style scoped>
.admins {
  padding: 20px;
  min-height: 100vh;
  background: linear-gradient(180deg, #f1f5f9, #e2e8f0);
  font-family: "Inter", sans-serif;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
  gap: 10px;
}

.header h1 {
  margin: 0;
  color: #0f172a;
}

.subtitle {
  font-size: 13px;
  color: #64748b;
}

/* BUTTON */
.btn-create {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

.btn-create:hover {
  transform: scale(1.05);
}

/* TABLE */
.table-container {
  overflow-x: auto;
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #f8fafc;
}

th,
td {
  padding: 14px;
  text-align: left;
  font-size: 14px;
}

th {
  color: #475569;
  font-weight: 600;
}

tbody tr {
  border-top: 1px solid #e2e8f0;
  transition: 0.2s;
}

tbody tr:hover {
  background: #f1f5f9;
}

/* STATUS */
.status {
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
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
  gap: 8px;
}

.actions button {
  border: none;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
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
@media (max-width: 768px) {
  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn-create {
    width: 100%;
  }

  th,
  td {
    font-size: 12px;
    padding: 10px;
  }
}
</style>
