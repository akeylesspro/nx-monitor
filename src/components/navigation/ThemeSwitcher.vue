<script setup lang="ts">
import { useTheme } from "../../composables/useTheme";

const { mode, setTheme, cycleTheme, THEME_OPTIONS } = useTheme();

const options = THEME_OPTIONS.map((option) => ({ value: option, label: option }));

const onChange = (e: Event) => {
    const target = e.target as HTMLSelectElement;
    const value = target.value as (typeof options)[number]["value"];
    setTheme(value);
};
</script>

<template>
    <div class="flex items-center gap-2 px-2 pb-2 border-b border-[var(--color-border)]">
        <label class="text-sm text-[var(--color-muted)]">Theme</label>
        <select
            class="p-2 rounded-md border bg-[var(--color-surface)] border-[var(--color-border)] text-[var(--color-text)]"
            :value="mode"
            @change="onChange"
        >
            <option v-for="opt in options" :key="opt.value" :value="opt.value">{{ opt.label }}</option>
        </select>
        <button class="px-2 py-1 rounded-md bg-[var(--color-primary)] text-[var(--color-on-primary)]" title="Cycle" @click="cycleTheme()">↻</button>
    </div>
</template>
