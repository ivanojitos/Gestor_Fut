import DashboardLayout from "@/views/Dashboard/DashboardLayout.vue";

export default {
  path: "/dashboard",
  name: "Dashboard",
  component: DashboardLayout,
  meta: { requiresAuth: true }, // 🔐 importante
  children: [
    {
      path: "",
      redirect: { name: "Perfil" },
    },
    {
      path: "home",
      name: "Home",
      component: () => import("@/views/Dashboard/Equipos/HomeView.vue"),
    },
    {
      path: "perfil",
      name: "Perfil",
      component: () => import("@/views/Dashboard/Perfil/PerfilView.vue"),
    },
    {
      path: "equipo/:id",
      name: "EquipoDetalle",
      component: () => import("@/views/Dashboard/Perfil/EquipoDetalleView.vue"),
    },
    {
      path: "modojuego/:id",
      name: "ModoJuego",
      component: () => import("@/views/Dashboard/Perfil/ModoJuegoView.vue"),
    },
    {
      path: "posiciones",
      name: "Posiciones",
      component: () => import("@/views/Dashboard/Equipos/EquiposView.vue"),
    },
    {
      path: "ligas",
      name: "Ligas",
      component: () => import("@/views/Dashboard/Ligas/LigasView.vue"),
    },
    {
      path: "torneos",
      name: "Torneos",
      component: () => import("@/views/Dashboard/Equipos/TorneosView.vue"),
    },
    {
      path: "roles",
      name: "Roles",
      component: () => import("@/views/Dashboard/RolesJuego/rolJuegoView.vue"),
    },
  ],
};