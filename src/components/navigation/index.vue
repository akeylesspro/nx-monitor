<script setup lang="ts">
import Buttons from "./Buttons.vue";
import Header from "./Header.vue";
import Footer from "./Footer.vue";
</script>

<template>
    <nav class="not-sm:hidden p-3 flex flex-col gap-4 w-64 bg-[var(--color-surface)] border-[var(--color-border)] border-e">
        <Header />
        <Buttons />
        <Footer />
    </nav>
</template>
