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
const className = "rounded-md block p-2 w-full h-full bg-[var(--color-muted)] text-[var(--color-on-primary)] hover:opacity-90";
const route = useRoute();
const isActive = computed(() => route.path === to.value);

const settings = useSettingsStore();
function onClick() {
    settings.closeMenu();
}
</script>

<template>
    <button>
        <router-link @click="onClick" :class="cn(className, isActive && 'bg-[var(--color-primary)]')" :to="to">{{ label }}</router-link>
    </button>
</template>
