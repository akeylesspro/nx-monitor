<script setup lang="ts">
import Navigation from "./components/navigation/index.vue";
</script>

<template>
    <div class="h-screen flex bg-[var(--color-bg)] text-[var(--color-text)]">
        <Navigation />
        <main class="p-6 flex-1 bg-[var(--color-surface)]">
            <router-view />
        </main>
    </div>
</template>
