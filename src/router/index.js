import { createRouter, createWebHistory } from "vue-router";
import LoginView from "../views/Session/loginView.vue";
import DashboardLayout from "../views/Dashboard/DashboardLayout.vue";
import HomeView from "../views/Dashboard/Equipos/HomeView.vue";
import TorneosView from "../views/Dashboard/Equipos/TorneosView.vue";
import LigasView from "../views/Dashboard/Ligas/LigasView.vue";
import PosicionesView from "../views/Dashboard/Equipos/EquiposView.vue";
import PerfilView from "../views/Dashboard/Perfil/PerfilView.vue";
import LoginSecundario from "../views/Session/loginsecundarioview.vue";
import RolJuegoView from "../views/Dashboard/RolesJuego/rolJuegoView.vue";
import DashArbitro from "../views/DashArbitro/dashboardView.vue";
import DashAdministrador from "../views/DashAdministrador/dashAdministradorView.vue";
import ProgramarJuegoView from "../views/DashAdministrador/programarJuegoView.vue";
import PartidosProgramadosView from "../views/DashAdministrador/partidosProgramadosView.vue";
import CreateJugador from "../views/Dashboard/Perfil/Jugadores/createJugardorView.vue";
import CrearUsuario from "../views/Session/createUsuarioView.vue";
import CreateArbitroView from "../views/Session/arbitro/CreateArbitroView.vue";
import CreateMaster from "../views/DashMaster/Ligas/createLiga.vue";
import dashboardMaster from "../views/DashMaster/Ligas/dashboardmasterView.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      component: LoginView,
    },
    {
      path: "/login-real",
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
          path: "equipo/:id",
          name: "EquipoDetalle",
          component: () =>
            import("../views/Dashboard/Perfil/EquipoDetalleView.vue"),
        },
        {
          path: "modojuego/:id",
          name: "ModoJuego",
          component: () =>
            import("../views/Dashboard/Perfil/ModoJuegoView.vue"),
        },
        {
          path: "posiciones",
          component: PosicionesView,
        },
        {
          path: "ligas",
          component: LigasView,
        },
        {
          path: "torneos",
          component: TorneosView,
        },
        {
          path: "roles",
          component: RolJuegoView,
        },
        {
          path: "dashArbitro",
          component: DashArbitro,
        },
        {
          path: "dashAdministrador",
          component: DashAdministrador,
        },
        {
          path: "programarJuego",
          component: ProgramarJuegoView,
        },
        {
          path: "partidosProgramados",
          name: "partidosProgramados",
          component: PartidosProgramadosView,
        },
        {
          path: "createJugador",
          component: CreateJugador,
        },
        {
          path: "crearArbitro",
          component: CreateArbitroView,
        },
        {
          path: "crearLiga",
          component: CreateMaster,
        },
        {
          path: "dashboardMaster",
          component: dashboardMaster,
        }
      ],
    },
    {
      path: "/crearUsuario",
      component: CrearUsuario,
    },
  ],
});

router.beforeEach((to, from) => {
  const isAuth = localStorage.getItem("auth");
  const role = localStorage.getItem("role");

  // 🔒 no autenticado
  if (to.path.startsWith("/dashboard") && !isAuth) {
    return "/";
  }

  // 🧤 no es árbitro
  if (to.path.includes("dashArbitro") && role !== "arbitro") {
    return "/dashboard";
  }

  // ✔ permitir navegación
  return true;
});

export default router;
