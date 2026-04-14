<template>
  <div class="layout">

    <!-- SIDEBAR -->
    <aside class="sidebar">
      <h2 class="logo">⚽ FutManager</h2>

      <nav>
        <router-link to="/dashboard/perfil">
          <Home /> <span>Perfil</span>
        </router-link>

        <router-link to="/dashboard/posiciones">
          <Users /> <span>Posiciones</span>
        </router-link>

        <router-link to="/dashboard/roles">
          <Users /> <span>Rol juego</span>
        </router-link>

        <router-link to="/dashboard/ligas">
          <Users /> <span>Ligas</span>
        </router-link>
      </nav>
    </aside>

    <!-- MAIN -->
    <div class="main">

      <!-- HEADER -->
      <header class="header">

        <button class="logout" @click="logout">
          🚪 Cerrar sesión
        </button>
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

const router = useRouter();

const logout = () => {
  localStorage.removeItem("auth");
  router.push("/");
};
</script>

<style scoped>

/* BASE */
.layout {
  display: flex;
  min-height: 100vh;
  background: #f3f4f6;
  font-family: "Segoe UI", sans-serif;
}

/* SIDEBAR */
.sidebar {
  width: 240px;
  background: #1e293b;
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* LOGO */
.logo {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
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
  color: #cbd5f5;
  transition: 0.2s;
}

nav a:hover {
  background: #334155;
  color: white;
}

/* ACTIVE */
.router-link-exact-active {
  background: #22c55e;
  color: #022c22;
  font-weight: bold;
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
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

/* TITLE */
.header h1 {
  font-size: 22px;
  color: #111;
}

/* LOGOUT BUTTON */
.logout {
  background: #ef4444;
  color: white;
  border: none;
  padding: 10px 14px;
  border-radius: 10px;
  cursor: pointer;
  transition: 0.2s;
  margin-left: auto; /* 🔥 esto lo manda al final */
}

.logout:hover {
  background: #dc2626;
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
  background: #cbd5f5;
  border-radius: 10px;
}

/* 🔥 RESPONSIVE */
@media (max-width: 900px) {

  .layout {
    flex-direction: column;
  }

  /* SIDEBAR → TOP NAV */
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
    display: none; /* 🔥 solo iconos en móvil */
  }

  /* HEADER */
  .header {
    padding: 12px 15px;
  }

  .header h1 {
    font-size: 18px;
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