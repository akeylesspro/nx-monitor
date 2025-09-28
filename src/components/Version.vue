<script setup lang="ts">
import { useSettingsStore } from "@/stores";
import packageJson from "../../package.json";
import { storeToRefs } from "pinia";
const settingsStore = useSettingsStore();
const { isRtl } = storeToRefs(settingsStore);
</script>

<template>
    <div dir="ltr" :class="`fixed bottom-2 ${isRtl ? 'left-2' : 'right-2'}`">v-{{ packageJson.version }}</div>
</template>
