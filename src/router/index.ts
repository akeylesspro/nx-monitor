import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
    {
        path: "/",
        name: "Home",
        component: () => import("../pages/Home.vue"),
    },
    {
        path: "/about",
        name: "About",
        component: () => import("../pages/About.vue"),
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
