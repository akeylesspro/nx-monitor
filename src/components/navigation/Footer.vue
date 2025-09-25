<script setup lang="ts">
import { toRefs } from "vue";
import { LanguageSwitcher, ThemeSwitcher } from "..";
import LogoutButton from "../LogoutButton.vue";

const props = defineProps<{
    class?: string;
}>();
const { class: className } = toRefs(props);
</script>

<template>
    <div class="flex items-center gap-2 p-2 border-t border-[var(--color-border)]" :class="className">
        <ThemeSwitcher />
        <LanguageSwitcher class="hidden md:block" />
        <LogoutButton />
    </div>
</template>
