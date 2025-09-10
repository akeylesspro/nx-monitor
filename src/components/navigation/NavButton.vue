<script setup lang="ts">
import { toRefs } from "vue";

const props = defineProps<{
    to: string;
    label: string;
}>();
const { to, label } = toRefs(props);
const className = "rounded-md block p-2 w-full h-full bg-[var(--color-primary)] text-[var(--color-on-primary)] hover:opacity-90";
</script>

<template>
    <button>
        <router-link :class="className" :to="to">{{ label }}</router-link>
    </button>
</template>
