<script setup lang="ts">
import { computed, toRefs } from "vue";
import type { ItemStatus } from "../../../types";
import { Title } from ".";
import { cn } from "../../../helpers";
const props = defineProps<{
    title: string;
    status: ItemStatus;
    timestamp: string;
}>();
const { title, status, timestamp } = toRefs(props);

const classNames = computed(() => {
    switch (status.value) {
        case "success":
            return { bg: "bg-green-100", icon: "fa-light fa-circle-check text-green-500", border: "border-green-500" };
        case "error":
            return { bg: "bg-red-100", icon: "fa-light fa-circle-xmark text-red-500", border: "border-red-500" };
        case "critical":
            return {
                bg: "bg-red-200 _critical-blink",
                icon: "fa-light fa-hexagon-exclamation _icon-blink",
                border: "border-red-500",
            };
        case "warning":
            return {
                bg: "bg-yellow-100",
                icon: "fa-light fa-triangle-exclamation text-yellow-500",
                border: "border-yellow-500",
            };
        case "info":
            return { bg: "bg-blue-100", icon: "fa-light fa-circle-info text-blue-500", border: "border-blue-500" };
        default:
            return { bg: "bg-blue-100", icon: "fa-light fa-circle-info text-blue-500", border: "border-blue-500" };
    }
});
</script>

<template>
    <div class="h-72 border rounded-md p-4 flex flex-col gap-2 text-black" :class="cn(classNames.bg, classNames.border)">
        <Title :title="title" :timestamp="timestamp" :classNames="classNames" />
        <slot />
    </div>
</template>

<style scoped>
._critical-blink {
    animation: criticalBlink 0.8s ease-in-out infinite;
}

@keyframes criticalBlink {
    0%,
    100% {
        background-color: initial;
    }
    50% {
        background-color: rgb(239 68 68);
    }
}
</style>
