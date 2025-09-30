import { useCacheStore } from "@/stores";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

export const initializeRouter = () => {
    const home: RouteRecordRaw = {
        path: "/",
        name: "home",
        component: () => import(`../components/monitorItems/Page.vue`),
        props: {
            pageName: "home",
        },
    };

    const router = createRouter({
        history: createWebHistory(),
        routes: [home, {
            path: "/:page",
            name: "dynamic-page",
            component: () => import(`../components/monitorItems/Page.vue`),
            props: (route) => ({ pageName: String(route.params.page) }),
        }],
    });

    router.beforeEach(async () => {
        const check = async () => {
            if (!useCacheStore().cacheLoaded) {
                await new Promise((resolve) => setTimeout(resolve, 1000));
                return check();
            }
            return true;
        };
        const result = await check();
        console.log("result beforeEach", result);
        return result;
    });
    return router;
};
