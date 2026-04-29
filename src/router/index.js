import { createRouter, createWebHistory } from "vue-router";

import authRoutes from "./modules/auth.routes";
import dashboardRoutes from "./modules/dashboard.routes";
import adminRoutes from "./modules/admin.routes";
import arbitroRoutes from "./modules/arbitro.routes";
import masterRoutes from "./modules/master.routes";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...authRoutes,

    {
      ...dashboardRoutes,
      children: [
        ...dashboardRoutes.children,
        ...adminRoutes,
        ...arbitroRoutes,
        ...masterRoutes,
      ],
    },
  ],
});

// 🛡️ GUARD
router.beforeEach((to) => {
  const isAuth = localStorage.getItem("auth");
  const role = localStorage.getItem("role");

  if (to.meta?.requiresAuth && !isAuth) {
    return { name: "Login" };
  }

  if (to.meta?.role && to.meta.role !== role) {
    return { name: "Dashboard" };
  }

  return true;
});

export default router;