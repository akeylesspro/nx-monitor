<script setup lang="ts">
import { computed, toRefs } from "vue";
import { useRoute } from "vue-router";
import { cn } from "../../helpers";
import { useSettingsStore } from "../../stores";

const props = defineProps<{
    to: string;
    label: string;
}>();
const { to, label } = toRefs(props);
const className = "rounded-md block text-start px-2 py-1 w-full h-full hover:bg-[var(--color-surface)] text-[var(--color-on-text)] hover:opacity-90";
const route = useRoute();
const isActive = computed(() => route.path === to.value);

const { setIsMenuOpen } = useSettingsStore();
</script>

<template>
    <button>
        <router-link @click="setIsMenuOpen(false)" :class="cn(className, isActive && 'bg-[var(--color-surface)]')" :to="to">{{ label }}</router-link>
    </button>
</template>
