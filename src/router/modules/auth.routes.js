export default [
  {
    path: "/",
    component: () => import("@/views/Session/loginView.vue"),
  },
  {
    path: "/login-real",
    component: () => import("@/views/Session/loginView.vue"),
  },
  {
    path: "/crearUsuario",
    component: () => import("@/views/Session/createUsuarioView.vue"),
  },
];