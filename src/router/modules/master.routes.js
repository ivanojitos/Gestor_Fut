export default [
  {
    path: "dashboardMaster",
    name: "DashboardMaster",
    component: () => import("@/views/DashMaster/dashboardmasterView.vue"),
    meta: { role: "master" },
  },
  {
    path: "dashboardMasterAdmin",
    name: "DashboardMasterAdmin",
    component: () => import("@/views/DashMaster/Administrador/indexView.vue"),
    meta: { role: "master" },
  },
  {
    path: "crearLiga",
    name: "CrearLiga",
    component: () => import("@/views/DashMaster/Ligas/createLiga.vue"),
    meta: { role: "master" },
  },
];