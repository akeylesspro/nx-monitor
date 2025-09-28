<script setup lang="ts">
import { Page } from "@/components";
import { useCacheStore } from "@/stores";
const cacheStore = useCacheStore();
</script>

<template>
    <Page :pageName="'home'" />
</template>
