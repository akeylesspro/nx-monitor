<script setup lang="ts">
import { parseSnapshotAsObject, socketServiceInstance } from "@/helpers";
import { useCacheStore, useUserStore } from "@/stores";
import { onMounted } from "vue";

const { setNxSettings, setSettings } = useCacheStore();
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
            ...parseSnapshotAsObject(setNxSettings, { debug: true, debugName: "nx-settings" }),
        },
        {
            collectionName: "settings",
            ...parseSnapshotAsObject(setSettings, { debug: true, debugName: "settings" }),
        },
    ]);
});
</script>

<template></template>
