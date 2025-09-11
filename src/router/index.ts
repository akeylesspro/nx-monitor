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
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
