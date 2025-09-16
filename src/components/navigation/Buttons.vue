<script setup lang="ts">
import { NavButton } from ".";
import { toRefs } from "vue";

const props = defineProps<{
    class?: string;
}>();
const { class: className } = toRefs(props);
</script>

<template>
    <div class="overflow-auto flex-1 flex flex-col gap-4 pe-2" :class="className">
        <NavButton to="/" label="Home" />
        <NavButton to="/about" label="About" />
        <NavButton to="/test" label="Test" />
    </div>
</template>
