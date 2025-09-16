<script setup lang="ts">
import { toRefs } from "vue";
import { LanguageSwitcher, ThemeSwitcher } from "..";

const props = defineProps<{
    class?: string;
}>();
const { class: className } = toRefs(props);
</script>

<template>
    <div class="flex items-center justify-between gap-4 px-2 pt-2 border-t border-[var(--color-border)]" :class="className">
        <ThemeSwitcher />
        <LanguageSwitcher class="hidden md:block" />
    </div>
</template>
