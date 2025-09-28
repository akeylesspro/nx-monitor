<script setup lang="ts">
import { computed, toRefs } from "vue";
import type { ItemFormat } from "@/types";

const props = defineProps<{
    value: number | string;
    format?: ItemFormat;
}>();
const { value, format } = toRefs(props);

const formatUi = computed(() => {
    switch (format.value) {
        case "currency":
            return "₪";
        case "percent":
            return "%";
        default:
            return "";
    }
});

const valueUi = computed(() => {
    switch (format.value) {
        case "int":
            return Number(value.value).toFixed(0);
        case "decimal":
            return Number(value.value).toFixed(2);
        default:
            return typeof value.value === "number" ? value.value.toFixed(0) : String(value.value);
    }
});
</script>

<template>
    <div class="text-6xl flex-1 flex items-center justify-center">
        <div :style="{ direction: formatUi ? 'ltr' : undefined }" class="flex gap-2 font-semibold">
            <div>{{ valueUi }}</div>
            <div v-if="formatUi">{{ formatUi }}</div>
        </div>
    </div>
</template>
