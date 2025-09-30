<script setup lang="ts">
import { computed, toRefs } from "vue";
import type { ItemStatus, MetaType, Thresholds } from "../../../types";
import { Title, Footer } from ".";
import { cn } from "../../../helpers";

const props = defineProps<{
    title: string;
    status: ItemStatus;
    timestamp?: any;
    url?: string;
    type: MetaType;
    updatedThreshold: Thresholds | undefined;
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
        class="h-72 border rounded-md px-3 py-2 flex flex-col gap-2 text-black animate-duration-400"
        :class="cn(classNames.bg, classNames.border, type !== 'chart' ? 'animate-flipleft ' : 'animate-fadeindown')"
    >
        <Title :title="title" :url="url" />
        <slot />
        <Footer :timestamp="timestamp" :updatedThreshold="updatedThreshold" />
    </div>
</template>

<style scoped></style>
