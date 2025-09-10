<script setup lang="ts">
import NavButton from "./NavButton.vue";
import ThemeSwitcher from "./ThemeSwitcher.vue";
</script>

<template>
    <nav class="p-4 flex flex-col gap-4 w-64 bg-[var(--color-surface)] border-[var(--color-border)] border-e">
        <ThemeSwitcher />
        <NavButton to="/" label="Home" />
        <NavButton to="/about" label="About" />
        <NavButton to="/contact" label="Contact" />
    </nav>
</template>
