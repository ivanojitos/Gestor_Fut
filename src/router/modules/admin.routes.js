export default [
  {
    path: "dashAdministrador",
    name: "DashAdministrador",
    component: () => import("@/views/DashAdministrador/dashAdministradorView.vue"),
    meta: { role: "admin" },
  },
  {
    path: "programarJuego",
    name: "ProgramarJuego",
    component: () => import("@/views/DashAdministrador/programarJuegoView.vue"),
    meta: { role: "admin" },
  },
  {
    path: "partidosProgramados",
    name: "PartidosProgramados",
    component: () => import("@/views/DashAdministrador/partidosProgramadosView.vue"),
    meta: { role: "admin" },
  },
  {
    path: "categorias",
    name: "Categorias",
    component: () => import("@/views/DashAdministrador/categorias/indexView.vue"),
    meta: { role: "admin" },
  },
  {
    path: "createCategoria",
    name: "CategoriasCreate",
    component: () => import("@/views/DashAdministrador/categorias/createView.vue"),
    meta: { role: "admin" },
  },
];