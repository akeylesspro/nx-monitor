<script setup lang="ts">
import { computed, toRefs } from "vue";
import type { ItemStatus, MetaType } from "../../../types";
import { Title, Footer } from ".";
import { cn } from "../../../helpers";

const props = defineProps<{
    title: string;
    status: ItemStatus;
    timestamp?: string;
    url?: string;
    type: MetaType;
}>();
const { title, status, timestamp, url, type } = toRefs(props);

const classNames = computed(() => {
    switch (status.value) {
        case "success":
            return { bg: "bg-green-100", border: "border-green-500" };
        case "error":
            return { bg: "bg-red-100", border: "border-red-500" };
        case "critical":
            return {
                bg: "bg-red-200 _critical-blink",
                border: "border-red-500",
            };
        case "warning":
            return {
                bg: "bg-yellow-100",
                border: "border-yellow-500",
            };
        case "info":
            return { bg: "bg-gray-100", border: "border-gray-500" };
        default:
            return { bg: "bg-gray-100", border: "border-gray-500" };
    }
});
</script>

<template>
    <div
        class="h-72 border rounded-md px-4 py-2 flex flex-col gap-2 text-black animate-duration-400"
        :class="cn(classNames.bg, classNames.border, type !== 'chart' ? 'animate-flipleft ' : 'animate-fadeindown')"
    >
        <Title :title="title" :timestamp="timestamp" :url="url" />
        <slot />
        <Footer :timestamp="timestamp" />
    </div>
</template>

<style scoped>
._critical-blink {
    animation: criticalBlink 0.6s ease-in-out infinite;
}

@keyframes criticalBlink {
    0%,
    100% {
        background-color: rgb(254, 226, 226);
    }
    50% {
        background-color: rgb(239 68 68);
    }
}
</style>
