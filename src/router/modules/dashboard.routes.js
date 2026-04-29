import DashboardLayout from "@/views/Dashboard/DashboardLayout.vue";

export default {
  path: "/dashboard",
  component: DashboardLayout,
  children: [
    {
      path: "",
      redirect: "/dashboard/perfil",
    },
    {
      path: "home",
      component: () => import("@/views/Dashboard/Equipos/HomeView.vue"),
    },
    {
      path: "perfil",
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
      component: () => import("@/views/Dashboard/Equipos/EquiposView.vue"),
    },
    {
      path: "ligas",
      component: () => import("@/views/Dashboard/Ligas/LigasView.vue"),
    },
    {
      path: "torneos",
      component: () => import("@/views/Dashboard/Equipos/TorneosView.vue"),
    },
    {
      path: "roles",
      component: () => import("@/views/Dashboard/RolesJuego/rolJuegoView.vue"),
    },
  ],
};