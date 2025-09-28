import { defineStore } from "pinia";
import { onMounted, ref } from "vue";
import { setState, type SetState } from "./helpers";
import type { DataItem, MetaItem, StringObject } from "@/types";
import { auth, parseSnapshotAsObject, socketServiceInstance } from "@/helpers";
import { useUserStore } from "./user";

export const useCacheStore = defineStore("cache", () => {
    const settings = ref<StringObject>({});
    const setSettings: SetState<StringObject> = (value) => setState(settings, value);
    const nxSettings = ref<StringObject>({});
    const setNxSettings: SetState<StringObject> = (value) => setState(nxSettings, value);
    const metaData = ref<MetaItem[]>([]);
    const setMetaData: SetState<MetaItem[]> = (value) => setState(metaData, value);
    const dataItem = ref<DataItem[]>([]);
    const setDataItem: SetState<DataItem[]> = (value) => setState(dataItem, value);
    onMounted(async () => {
        const userStore = useUserStore();
        const token = userStore.token;
        if (!token) {
            return;
        }
        socketServiceInstance.startSession(token);
        socketServiceInstance.subscribeToCollections([
            {
                collectionName: "nx-settings",
                ...parseSnapshotAsObject(setNxSettings, { debug: true, debugName: "nx-settings" }),
            },
            {
                collectionName: "settings",
                ...parseSnapshotAsObject(setSettings, { debug: true, debugName: "settings" }),
            }
        ]);
    });
    return { settings, setSettings, nxSettings, setNxSettings, metaData, setMetaData, dataItem, setDataItem };
});
