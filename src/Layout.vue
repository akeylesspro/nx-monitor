<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Config, Loader } from "./components";
import { MobileHeader } from "./components/Mobile";
import { Navigation } from "./components/navigation";
import { useCacheStore } from "./stores";

const { cacheLoaded } = storeToRefs(useCacheStore());
</script>

<template>
    <div class="h-dvh bg-[var(--color-bg)] text-[var(--color-text)]">
        <Config />
        <div v-if="!cacheLoaded" class="_full _center">
            <Loader twoSpinners :size="200"/>
        </div>
        <div v-else class="flex xl:flex-row flex-col gap-1 xl:gap-0 h-full">
            <Navigation />
            <MobileHeader />
            <main class="p-4 flex-1 overflow-auto">
                <router-view />
            </main>
        </div>
    </div>
</template>
