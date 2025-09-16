<script setup lang="ts">
import { MobileHeader } from "./components/Mobile";
import { Navigation } from "./components/navigation";

</script>

<template>
    <div class="h-dvh flex bg-[var(--color-bg)] text-[var(--color-text)] md:flex-row flex-col gap-1 md:gap-0">
        <Navigation />
        <MobileHeader />
        <main class="p-4 flex-1 bg-[var(--color-surface)] overflow-auto">
            <router-view />
        </main>
    </div>
</template>
