<script setup lang="ts">
import { useThemeStore } from "../stores";

const settings = useThemeStore();
const options = settings.THEME_OPTIONS.map((option) => ({ value: option, label: option }));
</script>

<template>
    <div class="flex justify-center gap-1 flex-col">
        <label class="text-sm">Theme</label>
        <select
            class="px-1 pb-1 rounded-md border bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)]"
            v-model="settings.theme"
        >
            <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
    </div>
</template>
