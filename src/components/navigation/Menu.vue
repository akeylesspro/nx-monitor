<script setup lang="ts">
import { Buttons, Header, Footer } from ".";
import { cn } from "../../helpers";
import { useSettingsStore } from "../../stores";
import { computed, onMounted, onUnmounted } from "vue";

const settings = useSettingsStore();
const { setIsMenuOpen } = settings;
const isOpen = computed(() => settings.isMenuOpen);

function onKeydown(e: KeyboardEvent) {
    if (e.key === "Escape") setIsMenuOpen(false);
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
    <nav class="xl:flex hidden p-3 flex-col gap-4 w-64  border-[var(--color-border)] border-e">
        <Buttons />
        <Footer />
    </nav>

    <!-- Mobile sidebar -->
    <div class="xl:hidden">
        <div aria-modal="true" v-show="isOpen" class="fixed inset-0 bg-black/50 z-40" @click="setIsMenuOpen(false)" />
        <nav
            v-show="isOpen"
            :class="
                cn(
                    'fixed z-50 inset-y-0  w-48 p-3 flex flex-col gap-4  border-[var(--color-border)] border-e ',
                    settings.isRtl ? 'right-0' : 'left-0'
                )
            "
        >
            <Buttons />
            <Footer />
        </nav>
    </div>
</template>
