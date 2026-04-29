export default [
  {
    path: "dashAdministrador",
    component: () => import("@/views/DashAdministrador/dashAdministradorView.vue"),
  },
  {
    path: "programarJuego",
    component: () => import("@/views/DashAdministrador/programarJuegoView.vue"),
  },
  {
    path: "partidosProgramados",
    name: "partidosProgramados",
    component: () => import("@/views/DashAdministrador/partidosProgramadosView.vue"),
  },
  {
    path: "categorias",
    component: () => import("@/views/DashAdministrador/categorias/indexView.vue"),
  },
];