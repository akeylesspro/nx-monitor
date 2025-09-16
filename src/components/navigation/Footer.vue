<script setup lang="ts">
import { toRefs } from "vue";
import ThemeSwitcher from "../ThemeSwitcher.vue";

const props = defineProps<{
    class?: string;
}>();
const { class: className } = toRefs(props);
</script>

<template>
    <div class="flex items-center px-2 pt-2 border-t border-[var(--color-border)]" :class="className">
        <ThemeSwitcher />
    </div>
</template>
