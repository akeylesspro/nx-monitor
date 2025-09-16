<script setup lang="ts">
import { cn } from "../helpers";
import { toRefs } from "vue";
import { theme } from "../theme";
const props = defineProps<{
    class?: string;
    containerClass?: string;
}>();
const { class: className, containerClass } = toRefs(props);
</script>

<template>
    <div :class="cn('flex items-center justify-center', theme === 'light' && 'bg-black/80 p-2 rounded-md', containerClass)">
        <router-link to="/"> <img src="/akeyless_logo_big.png" alt="Akeyless Logo" :class="cn('h-12', className)" /> </router-link>
    </div>
</template>

<style lang="scss" scoped></style>
