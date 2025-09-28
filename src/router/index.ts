import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "home",
        component: () => import("../pages/Home/index.vue"),
    },
    {
        path: "/servers",
        name: "servers",
        component: () => import("../pages/Servers/index.vue"),
    },
    {
        path: "/test",
        name: "test",
        component: () => import("../pages/Test/index.vue"),
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

// router.beforeEach(async (to) => {
//     console.log("beforeEach", to);
//     await new Promise((resolve) => setTimeout(resolve, 1000));
//     return true;
// });

export default router;
