<script setup lang="ts">
import { Page } from "@/components";
import { useCacheStore } from "@/stores";
import { storeToRefs } from "pinia";
import { effect, ref } from "vue";
const pageName = ref("home");
const cacheStore = useCacheStore();
// const { metaData, dataItem, nxSettings, settings } = storeToRefs(cacheStore);

// effect(() => {
//     console.log("nxSettings", nxSettings.value);
//     console.log("settings", settings.value);
// });
</script>

<template>
    <Page :pageName="pageName" />
</template>
