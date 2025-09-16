<script setup lang="ts">
import { Buttons, Header, Footer } from ".";
import { useSettingsStore } from "../../stores";
import { computed, onMounted, onUnmounted } from "vue";

const settings = useSettingsStore();
const { closeMenu } = settings;
const isOpen = computed(() => settings.isMenuOpen);

function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") settings.closeMenu();
}

onMounted(() => {
    window.addEventListener("keydown", onKeydown);
});
onUnmounted(() => {
    window.removeEventListener("keydown", onKeydown);
});
</script>

<template>
    <!-- Desktop sidebar -->
    <nav class="md:flex hidden p-3 flex-col gap-4 w-64 bg-[var(--color-surface)] border-[var(--color-border)] border-e">
        <Header />
        <Buttons />
        <Footer />
    </nav>

    <!-- Mobile drawer + backdrop -->
    <div class="md:hidden">
        <div v-show="isOpen" class="fixed inset-0 bg-black/40 z-40" @click="closeMenu" />
        <nav
            class="fixed z-50 inset-y-0 left-0 w-48 p-3 flex flex-col gap-4 bg-[var(--color-surface)] border-[var(--color-border)] border-e transform transition-transform duration-300"
            :class="isOpen ? 'translate-x-0' : '-translate-x-full'"
        >
            <Header :isMobile="true" />
            <Buttons />
            <Footer />
        </nav>
    </div>
</template>
