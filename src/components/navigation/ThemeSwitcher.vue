<script setup lang="ts">
import { useTheme } from "../../composables/useTheme";

const { theme, THEME_OPTIONS } = useTheme();

const options = THEME_OPTIONS.map((option) => ({ value: option, label: option }));
</script>

<template>
    <div class="flex items-center gap-2 px-2">
        <label class="text-sm text-[var(--color-muted)]">Theme</label>
        <select
            class="px-2 pt-1 pb-2 rounded-md border bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)]"
            v-model="theme"
        >
            <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
    </div>
</template>
