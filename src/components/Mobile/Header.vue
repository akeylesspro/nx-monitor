<script setup lang="ts">
import { LanguageSwitcher } from "..";
import { useSettingsStore } from "../../stores";
import AkeylessLogo from "../AkeylessLogo.vue";

const { setIsMenuOpen } = useSettingsStore();
</script>

<template>
    <div class="flex items-center justify-between xl:hidden px-3 py-2 border-b border-[var(--color-border)]">
        <div class="flex items-center gap-2">
            <button
                class="p-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text)]"
                aria-label="Toggle menu"
                @click="setIsMenuOpen((prev) => !prev)"
            >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6">
                    <path
                        fill-rule="evenodd"
                        d="M3.75 5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm0 6a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 0 1.5h-15a.75.75 0 0 1-.75-.75Zm.75 5.25a.75.75 0 0 0 0 1.5h15a.75.75 0 0 0 0-1.5h-15Z"
                        clip-rule="evenodd"
                    />
                </svg>
            </button>
            <LanguageSwitcher />
        </div>
        <AkeylessLogo class="h-8" />
    </div>
</template>
