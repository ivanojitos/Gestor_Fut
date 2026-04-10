import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/Session/loginView.vue";
import DashboardLayout from "../views/Dashboard/DashboardLayout.vue";
import HomeView from "../views/Dashboard/Equipos/HomeView.vue";
import TorneosView from "../views/Dashboard/Equipos/TorneosView.vue";
import LigasView from "../views/Dashboard/Ligas/LigasView.vue";
import EquiposView from "../views/Dashboard/Equipos/EquiposView.vue";
import PerfilView from "../views/Dashboard/Perfil/PerfilView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: LoginView,
    },
    {
      path: "/dashboard",
      component: DashboardLayout,
      children: [
        {
          path: "",
          redirect: "/dashboard/perfil",
        },
        {
          path: "home",
          component: HomeView,
        },
        {
          path: "perfil",
          component: PerfilView,
        },
        {
          path: "equipos",
          component: EquiposView,
        },
        {
          path: "ligas",
          component: LigasView,
        },
        {
          path: "torneos",
          component: TorneosView,
        },
      ],
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isAuth = localStorage.getItem("auth");

  if (to.path === "/dashboard" && !isAuth) {
    next("/");
  } else {
    next();
  }
});

export default router;
