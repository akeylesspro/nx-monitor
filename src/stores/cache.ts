import { defineStore } from "pinia";
import { computed, effect, ref } from "vue";
import { setState, type SetState } from "./helpers";
import type { DataItem, MetaItem, StringObject } from "@/types";
import { router } from "@/main";
import { useSettingsStore } from "./settings";

export const useCacheStore = defineStore("cache", () => {
    // loaded indicator
    const cacheLoaded = ref(false);
    const setCacheLoaded: SetState<boolean> = (value) => setState(cacheLoaded, value);
    // settings
    const settings = ref<StringObject>({});
    const setSettings: SetState<StringObject> = (value) => setState(settings, value);
    const nxSettings = ref<StringObject>({});
    const setNxSettings: SetState<StringObject> = (value) => setState(nxSettings, value);
    // translations
    const translations = ref<StringObject>({});
    const setTranslations: SetState<StringObject> = (value) => setState(translations, value);
    const getTranslations = computed(() => (id: string, prefix?: string, key?: string) => {
        return computed(() => {
            const currentLanguage = useSettingsStore().currentLanguage;
            const currentTranslations = translations.value[id];
            if (!currentTranslations) {
                if (prefix && key) {
                    return key.toCapitalCase();
                }
                return {};
            }
            if (prefix && key) {
                return currentTranslations?.[currentLanguage]?.[`${prefix}__${key}`] ?? key!.toCapitalCase();
            }
            return currentTranslations?.[currentLanguage] ?? {};
        });
    });
    const getMonitorTranslations = computed(() => (prefix?: string, key?: string) => {
        return getTranslations.value("monitor", prefix, key);
    });

    // monitor data
    const metaData = ref<MetaItem[]>([]);
    const setMetaData: SetState<MetaItem[]> = (value) => setState(metaData, value);
    const dataItems = ref<StringObject<DataItem>>({});
    const setDataItems: SetState<StringObject<DataItem>> = (value) => setState(dataItems, value);
    const getMetaItems = (metaData: MetaItem[], pageName: string) => metaData.filter((item) => (item.pages || []).includes(pageName));
    // routing
    const pages = computed(() => Array.from(new Set(metaData.value.map((item) => item.pages).flat())).filter((page) => page !== "home"));
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
        translations,
        setTranslations,
        getTranslations,
        getMonitorTranslations,
        metaData,
        setMetaData,
        dataItems,
        setDataItems,
        getMetaItems,
        pages,
    };
});
