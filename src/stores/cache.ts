import { defineStore } from "pinia";
import { computed, effect, ref } from "vue";
import { setState, type SetState } from "./helpers";
import type { DataItem, MetaItem, StringObject } from "@/types";
import { router } from "@/main";

export const useCacheStore = defineStore("cache", () => {
    const cacheLoaded = ref(false);
    const setCacheLoaded: SetState<boolean> = (value) => setState(cacheLoaded, value);
    const settings = ref<StringObject>({});
    const setSettings: SetState<StringObject> = (value) => setState(settings, value);
    const nxSettings = ref<StringObject>({});
    const setNxSettings: SetState<StringObject> = (value) => setState(nxSettings, value);
    const metaData = ref<MetaItem[]>([]);
    const setMetaData: SetState<MetaItem[]> = (value) => setState(metaData, value);
    const dataItems = ref<StringObject<DataItem>>({});
    const setDataItems: SetState<StringObject<DataItem>> = (value) => setState(dataItems, value);
    const getMetaItems = (metaData: MetaItem[], pageName: string) => metaData.filter((item) => (item.pages || []).includes(pageName));
    const pages = computed(() => Array.from(new Set(metaData.value.map((item) => item.pages).flat())).filter((page) => page !== "home"));
    // add routes to router
    effect(() => {
        if (!pages.value.length) {
            return;
        }
        pages.value.forEach((page) => {
            if (router.hasRoute(page)) {
                return;
            }
            router.addRoute({
                path: `/${page}`,
                name: page,
                component: () => import(`../components/monitorItems/Page.vue`),
                props: {
                    pageName: page,
                },
            });
        });
    });
    return {
        cacheLoaded,
        setCacheLoaded,
        settings,
        setSettings,
        nxSettings,
        setNxSettings,
        metaData,
        setMetaData,
        dataItems,
        setDataItems,
        getMetaItems,
        pages,
    };
});
