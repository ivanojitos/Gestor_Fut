export default [
  {
    path: "dashArbitro",
    name: "DashArbitro",
    component: () => import("@/views/DashArbitro/dashboardView.vue"),
    meta: { role: "arbitro" },
  },
];