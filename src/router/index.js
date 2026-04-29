import { createRouter, createWebHistory } from "vue-router";

// 📦 módulos de rutas
import authRoutes from "./modules/auth.routes";
import dashboardRoutes from "./modules/dashboard.routes";
import adminRoutes from "./modules/admin.routes";
import arbitroRoutes from "./modules/arbitro.routes";
import masterRoutes from "./modules/master.routes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 🔐 autenticación
    ...authRoutes,

    // 🧩 dashboard principal
    {
      ...dashboardRoutes,
      children: [
        ...dashboardRoutes.children,

        // 👇 módulos adicionales dentro del dashboard
        ...adminRoutes,
        ...arbitroRoutes,
        ...masterRoutes,
      ],
    },
  ],
});

// 🛡️ navegación protegida
router.beforeEach((to) => {
  const isAuth = localStorage.getItem("auth");
  const role = localStorage.getItem("role");

  // 🔒 proteger dashboard
  if (to.path.startsWith("/dashboard") && !isAuth) {
    return "/";
  }

  // 🎭 validar rol si la ruta lo requiere
  if (to.meta?.role && to.meta.role !== role) {
    return "/dashboard";
  }

  return true;
});

export default router;