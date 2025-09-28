<script setup lang="ts">
import { parseSnapshotAsArray, parseSnapshotAsObject, socketServiceInstance } from "@/helpers";
import { useCacheStore, useUserStore } from "@/stores";
import { onMounted } from "vue";

const { setNxSettings, setSettings, setDataItems, setMetaData } = useCacheStore();
const userStore = useUserStore();
onMounted(async () => {
    const token = userStore.token;
    if (!token) {
        return;
    }
    socketServiceInstance.startSession(token);
    socketServiceInstance.subscribeToCollections([
        {
            collectionName: "nx-settings",
            ...parseSnapshotAsObject(setNxSettings),
        },
        {
            collectionName: "settings",
            ...parseSnapshotAsObject(setSettings),
        },
        {
            collectionName: "nx-monitor-data",
            ...parseSnapshotAsObject(setDataItems, { debug: true, debugName: "nx-monitor-data" }),
        },
        {
            collectionName: "nx-monitor-meta",
            ...parseSnapshotAsArray(setMetaData, { debug: true, debugName: "nx-monitor-meta" }),
        },
    ]);

    socketServiceInstance.onConnect(() => {
        socketServiceInstance.onDisconnect(() => {
            // window.location.reload();
            alert("🔴 Socket disconnected");
        });
    });
});
</script>

<template></template>
