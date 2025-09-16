<script setup lang="ts">
import { ThemeSwitcher } from "../../theme";
import { toRefs } from "vue";

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
