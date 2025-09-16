<script setup lang="ts">
import { useSettingsStore } from "../../stores";
import AkeylessLogo from "../AkeylessLogo.vue";

const settings = useSettingsStore();
function onToggleMenu() {
    settings.toggleMenu();
}
</script>

<template>
    <div class="flex items-center justify-between md:hidden px-3 py-2 border-b border-[var(--color-border)]">
        <button
            class="p-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]"
            aria-label="Toggle menu"
            @click="onToggleMenu"
        >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                <path
                    fill-rule="evenodd"
                    d="M3.75 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm.75 5.25a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5h-15Z"
                    clip-rule="evenodd"
                />
            </svg>
        </button>
        <AkeylessLogo class="h-8" />
    </div>
</template>
