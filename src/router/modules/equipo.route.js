export default [
  {
    path: "/equipoDetalle",
    name: "EquipoDetalle",
    component: () => import("@/views/Dashboard/Perfil/EquipoDetalleView.vue"),
  },
  {
    path: "/modoJuego",
    name: "ModoJuego",
    component: () => import("@/views/Dashboard/Perfil/ModoJuegoView.vue"),
  },
  {
    path: "/buscarEquipo",
    name: "BuscarEquipo",
    component: () =>
      import("@/views/Dashboard/Perfil//Jugadores/BuscarEquipoView.vue"),
  },
];
