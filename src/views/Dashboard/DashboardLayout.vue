<template>
  <div class="layout">
    <!-- SIDEBAR -->
    <aside class="sidebar">
    <div class="logo-wrapper">
        <img src="/logos/logo completo.png" alt="PlayNexus Logo" class="logo" />
      </div>

      <nav>
        <!-- JUGADOR -->
        <router-link v-if="role === 'jugador'" :to="{ name: 'Perfil' }">
          <Home /> <span>Perfil</span>
        </router-link>

        <router-link v-if="role === 'jugador'" :to="{ name: 'Posiciones' }">
          <Trophy /> <span>Posiciones</span>
        </router-link>

        <router-link v-if="role === 'jugador'" :to="{ name: 'Roles' }">
          <Shield /> <span>Rol juego</span>
        </router-link>
        <!-- 
        <router-link v-if="role === 'jugador'" :to="{ name: 'Ligas' }">
          <Medal /> <span>Ligas</span>
        </router-link> -->

        <!-- MASTER -->
        <router-link v-if="role === 'master'" :to="{ name: 'CrearLiga' }">
          <PlusCircle /> <span>Crear Ligas</span>
        </router-link>

        <router-link
          v-if="role === 'master'"
          :to="{ name: 'DashboardMasterAdmin' }"
        >
          <UserCog /> <span>Administrador</span>
        </router-link>

        <!-- ADMIN -->
        <router-link v-if="role === 'admin'" :to="{ name: 'Categorias' }">
          <Layers /> <span>Categorias</span>
        </router-link>

        <!-- <router-link v-if="role === 'admin'" :to="{ name: 'Equipos' }">
          <Flag /> <span>Equipos</span>
        </router-link> -->
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
import { ref, onMounted } from "vue";
import {
  Home,
  Table,
  Users,
  Trophy,
  Shield,
  Medal,
  PlusCircle,
  UserCog,
  Layers,
  Flag,
} from "lucide-vue-next";

const router = useRouter();
const role = ref("");

const logout = () => {
  localStorage.removeItem("auth");
  router.push("/");
};

onMounted(() => {
  role.value = localStorage.getItem("role"); // 👈 🔥 ESTA ES LA CLAVE
});
</script>

<style scoped>
/* BASE */
.layout {
  display: flex;
  min-height: 100vh;
  background: #f4f7fb;
  font-family: "Segoe UI", sans-serif;
  color: #111827;
}

/* SIDEBAR */
.sidebar {
  width: 260px;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(14px);

  padding: 24px 18px;

  display: flex;
  flex-direction: column;
  gap: 35px;

  border-right: 1px solid rgba(0, 0, 0, 0.06);

  box-shadow: 4px 0 25px rgba(0, 0, 0, 0.04);

  position: relative;
  z-index: 10;
}

/* LOGO */
.logo-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 10px 0 20px;

  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.logo {
  width: 180px;
  max-width: 100%;
  object-fit: contain;

  transition: all 0.3s ease;

  filter:
    drop-shadow(0 8px 18px rgba(0, 0, 0, 0.12))
    drop-shadow(0 0 12px rgba(59, 130, 246, 0.15));
}

.logo:hover {
  transform: scale(1.04);
}

/* NAVIGATION */
nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* LINKS */
nav a {
  display: flex;
  align-items: center;
  gap: 14px;

  padding: 14px 16px;

  border-radius: 16px;

  text-decoration: none;

  color: #334155;

  font-size: 14px;
  font-weight: 600;

  transition: all 0.25s ease;

  position: relative;
  overflow: hidden;
}

/* ICONS */
nav a svg {
  width: 20px;
  height: 20px;
}

/* HOVER */
nav a:hover {
  background: linear-gradient(
    135deg,
    rgba(59, 130, 246, 0.12),
    rgba(99, 102, 241, 0.12)
  );

  color: #2563eb;

  transform: translateX(4px);
}

/* ACTIVE LINK */
.router-link-exact-active {
  background: linear-gradient(135deg, #3b82f6, #6366f1);

  color: white;

  box-shadow:
    0 10px 20px rgba(59, 130, 246, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.2);
}

.router-link-exact-active svg {
  color: white;
}

/* MAIN */
.main {
  flex: 1;

  display: flex;
  flex-direction: column;

  min-width: 0;
}

/* HEADER */
.header {
  height: 78px;

  background: rgba(255, 255, 255, 0.9);

  backdrop-filter: blur(10px);

  border-bottom: 1px solid rgba(0, 0, 0, 0.05);

  display: flex;
  align-items: center;
  justify-content: flex-end;

  padding: 0 24px;

  position: sticky;
  top: 0;

  z-index: 5;
}

/* LOGOUT BUTTON */
.logout {
  border: none;

  background: linear-gradient(135deg, #ef4444, #dc2626);

  color: white;

  padding: 12px 18px;

  border-radius: 14px;

  font-size: 14px;
  font-weight: 700;

  cursor: pointer;

  transition: all 0.25s ease;

  box-shadow:
    0 10px 20px rgba(239, 68, 68, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

/* HOVER LOGOUT */
.logout:hover {
  transform: translateY(-2px);

  box-shadow:
    0 15px 25px rgba(239, 68, 68, 0.35),
    0 0 18px rgba(239, 68, 68, 0.25);
}

/* CONTENT */
.content {
  flex: 1;

  padding: 24px;

  overflow-y: auto;
}

/* SCROLL */
.content::-webkit-scrollbar {
  width: 8px;
}

.content::-webkit-scrollbar-thumb {
  background: linear-gradient(135deg, #3b82f6, #6366f1);
  border-radius: 20px;
}

/* TABLET */
@media (max-width: 900px) {
  .layout {
    flex-direction: column;
  }

  .sidebar {
    width: 100%;

    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    padding: 12px 16px;

    gap: 15px;
  }

  .logo-wrapper {
    padding: 0;
    border: none;
  }

  .logo {
    width: 135px;
  }

  nav {
    flex-direction: row;
    align-items: center;
    gap: 8px;
  }

  nav a {
    padding: 10px;
    border-radius: 12px;
  }

  nav span {
    display: none;
  }

  .header {
    padding: 0 15px;
  }

  .logout {
    padding: 10px 14px;
    font-size: 13px;
  }

  .content {
    padding: 18px;
  }
}

/* MOBILE */
@media (max-width: 600px) {
  .sidebar {
    flex-wrap: wrap;
    justify-content: center;
  }

  .logo {
    width: 115px;
  }

  nav {
    width: 100%;
    justify-content: center;
    flex-wrap: wrap;
  }

  nav a {
    flex: 1;
    justify-content: center;
    min-width: 55px;
  }

  .header {
    height: 70px;
  }

  .logout {
    width: 100%;
  }

  .content {
    padding: 15px;
  }
}

</style>
