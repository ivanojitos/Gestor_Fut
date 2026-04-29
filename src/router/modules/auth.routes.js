export default [
  {
    path: "/",
    name: "Login",
    component: () => import("@/views/Session/loginView.vue"),
  },
  {
    path: "/login-real",
    name: "LoginReal",
    component: () => import("@/views/Session/loginView.vue"),
  },
  {
    path: "/crearUsuario",
    name: "CrearUsuario",
    component: () => import("@/views/Session/createUsuarioView.vue"),
  },
];