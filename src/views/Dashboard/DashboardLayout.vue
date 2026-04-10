<template>
  <div class="layout">
    <!-- Sidebar -->
    <aside class="sidebar">
      <h2 class="logo">⚽ FutManager</h2>

      <nav>
        <router-link to="/dashboard/perfil"> <Home /> Perfil </router-link>

        <!-- <router-link to="/dashboard/torneos"> <Trophy /> Torneos </router-link> -->

        <router-link to="/dashboard/equipos"> <Users /> Equipos </router-link>

        <router-link to="/dashboard/ligas"> <Users /> Ligas </router-link>
      </nav>

      <button class="logout" @click="logout">Cerrar sesión</button>
    </aside>

    <!-- Contenido -->
    <div class="main">
      <header class="header">
        <h1>Datos Personales</h1>
      </header>

      <section class="content">
        <router-view />
      </section>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { Home, Trophy, Users } from "lucide-vue-next";
const router = useRouter();

const logout = () => {
  localStorage.removeItem("auth");
  router.push("/");
};
</script>

<style scoped>
/* LAYOUT GENERAL */
.layout {
  display: flex;
  height: 100vh;
  background: linear-gradient(135deg, #ffffff, #ffffff);
  color: #f1f5f9;
  font-family: "Segoe UI", sans-serif;
}

/* SIDEBAR */
.sidebar {
  width: 260px;
  background: linear-gradient(180deg, #83a3ec, #1e293b);
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 5px 0 20px rgba(0, 0, 0, 0.3);
}

/* LOGO */
.logo {
  font-size: 24px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 40px;
  color: #2a2c2b;
  letter-spacing: 2px;
}

/* NAV */
nav {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

nav a {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  border-radius: 12px;
  text-decoration: none;
  color: #e2e8f0;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

/* ICONOS MÁS GRANDES */
nav svg {
  width: 22px;
  height: 22px;
}

/* HOVER */
nav a:hover {
  background: rgba(136, 107, 184, 0.2);
  color: #ffffff;
  transform: translateX(6px);
}

/* ACTIVE */
.router-link-exact-active {
  background: linear-gradient(90deg, #22c55e, #4ade80);
  color: #022c22;
  font-weight: bold;
  box-shadow: 0 0 15px rgba(34, 197, 94, 0.6);
}

/* BOTÓN LOGOUT */
.logout {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border: none;
  padding: 14px;
  border-radius: 12px;
  color: white;
  font-size: 15px;
  cursor: pointer;
  transition: 0.3s;
}

.logout:hover {
  transform: scale(1.07);
  box-shadow: 0 0 12px rgba(239, 68, 68, 0.7);
}

/* MAIN */
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* HEADER */
.header {
  background: rgba(98, 140, 206, 0.9);
  backdrop-filter: blur(6px);
  padding: 25px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.header h1 {
  font-size: 26px;
  font-weight: bold;
  color: #000000;
}

/* CONTENIDO */
.content {
  padding: 30px;
  overflow-y: auto;
}

/* SCROLL */
.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-thumb {
  background: #fafffc;
  border-radius: 10px;
}
</style>
