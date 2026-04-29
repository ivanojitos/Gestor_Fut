export default [
  {
    path: "/",
    name: "Login",
    component: () => import("@/views/Session/loginView.vue"),
  },
  {
    path: "/login-real",
    redirect: { name: "Login" },
  },
  {
    path: "/crearUsuario",
    name: "CrearUsuario",
    component: () => import("@/views/Session/createUsuarioView.vue"),
  },
];