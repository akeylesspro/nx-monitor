import { defineStore } from "pinia";
import { ref } from "vue";
import { setState, type SetState } from "./helpers";
import type { DataItem, MetaItem, StringObject } from "@/types";

export const useCacheStore = defineStore("cache", () => {
    const settings = ref<StringObject>({});
    const setSettings: SetState<StringObject> = (value) => setState(settings, value);
    const nxSettings = ref<StringObject>({});
    const setNxSettings: SetState<StringObject> = (value) => setState(nxSettings, value);
    const metaData = ref<MetaItem[]>([]);
    const setMetaData: SetState<MetaItem[]> = (value) => setState(metaData, value);
    const dataItems = ref<StringObject<DataItem>>({});
    const setDataItems: SetState<StringObject<DataItem>> = (value) => setState(dataItems, value);
    const getMetaItems = (metaData: MetaItem[], pageName: string) => metaData.filter((item) => (item.pages || []).includes(pageName));

    return { settings, setSettings, nxSettings, setNxSettings, metaData, setMetaData, dataItems, setDataItems, getMetaItems };
});
