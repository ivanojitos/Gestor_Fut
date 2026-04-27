<template>
  <div class="layout">
    <!-- SIDEBAR -->
    <aside class="sidebar">
      <h2 class="logo">⚽ FutManager</h2>

      <nav>
        <router-link v-if="role === 'jugador'" to="/dashboard/perfil">
          <Home /> <span>Perfil</span>
        </router-link>

        <router-link v-if="role === 'jugador'" to="/dashboard/posiciones">
          <Users /> <span>Posiciones</span>
        </router-link>

        <router-link v-if="role === 'jugador'" to="/dashboard/roles">
          <Users /> <span>Rol juego</span>
        </router-link>

        <router-link v-if="role === 'jugador'" to="/dashboard/ligas">
          <Users /> <span>Ligas</span>
        </router-link>

         <router-link v-if="role === 'master'" to="/dashboard/crearLiga">
          <Users /> <span>Crear Ligas</span>
        </router-link>
      </nav>
    </aside>

    <!-- MAIN -->
    <div class="main">
      <!-- HEADER -->
      <header class="header">
        <button class="logout" @click="logout">🚪 Cerrar sesión</button>
      </header>

      <!-- CONTENT -->
      <section class="content">
        <router-view />
      </section>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { Home, Users } from "lucide-vue-next";
import { ref, onMounted } from "vue";

const router = useRouter();
const role = ref("");

const logout = () => {
  localStorage.removeItem("auth");
  router.push("/");
};

onMounted(() => {
  role.value = localStorage.getItem("role");
});
</script>

<style scoped>
/* BASE */
.layout {
  display: flex;
  min-height: 100vh;
  background: #f3f3f3;
  font-family: "Segoe UI", sans-serif;
  color: #111827;
}

/* SIDEBAR */
.sidebar {
  width: 240px;
  background: #ffffff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
  border-right: 1px solid #e5e7eb;
}

/* LOGO */
.logo {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  color: #111827;
}

/* NAV */
nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

nav a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 10px;
  text-decoration: none;
  color: #111827;
  transition: 0.2s;
}

/* HOVER 🔵 */
nav a:hover {
  background: #e0f2fe;
}

/* ACTIVE 🔵 */
.router-link-exact-active {
  background: #bae6fd;
  color: #0284c7;
  font-weight: 600;
}

/* MAIN */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* HEADER */
.header {
  display: flex;
  align-items: center;
  background: #ffffff;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

/* LOGOUT BUTTON */
.logout {
  background: #0284c7;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
  margin-left: auto;
}

.logout:hover {
  background: #0369a1;
}

/* CONTENT */
.content {
  padding: 20px;
  overflow-y: auto;
}

/* SCROLL */
.content::-webkit-scrollbar {
  width: 6px;
}

.content::-webkit-scrollbar-thumb {
  background: #0284c7;
  border-radius: 10px;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 15px;
  }

  .logo {
    font-size: 16px;
  }

  nav {
    flex-direction: row;
    gap: 5px;
  }

  nav a {
    padding: 8px;
    font-size: 12px;
  }

  nav span {
    display: none;
  }

  .header {
    padding: 12px 15px;
  }

  .logout {
    padding: 8px 10px;
    font-size: 12px;
  }

  .content {
    padding: 15px;
  }
}
</style>
