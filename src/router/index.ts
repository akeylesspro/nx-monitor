import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "Home",
        component: () => import("../pages/Home/index.vue"),
    },
    {
        path: "/about",
        name: "About",
        component: () => import("../pages/About/index.vue"),
    },
    {
        path: "/test",
        name: "Test",
        component: () => import("../pages/test/index.vue"),
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
