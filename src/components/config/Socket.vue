<script setup lang="ts">
import { parseSnapshotAsArray, parseSnapshotAsObject, socketServiceInstance } from "@/helpers";
import { useCacheStore, useUserStore } from "@/stores";
import { onMounted, onUnmounted, ref } from "vue";

const { setNxSettings, setSettings, setDataItems, setMetaData, setCacheLoaded } = useCacheStore();
const userStore = useUserStore();
const unsubscribe = ref<() => void>();
onMounted(async () => {
    const token = userStore.token;
    if (!token) {
        return;
    }
    socketServiceInstance.startSession(token);
    try {
        unsubscribe.value = await socketServiceInstance.subscribeToCollections([
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
    } catch (error) {
        console.error("Error subscribing to collections", error);
    }

    setCacheLoaded(true);
    socketServiceInstance.onConnect(() => {
        socketServiceInstance.onDisconnect(() => {
            // window.location.reload();
            unsubscribe.value?.();
            alert("🔴 Socket disconnected");
        });
    });
});
onUnmounted(() => {
    unsubscribe.value?.();
});
</script>

<template></template>
