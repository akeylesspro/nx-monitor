<script setup lang="ts">
import { computed, toRefs } from "vue";
import type { ItemFormat } from "../../types";

const props = defineProps<{
    value: number;
    format?: ItemFormat;
}>();
const { value, format } = toRefs(props);
const formatUi = computed(() => {
    switch (format.value) {
        case "currency":
            return "₪";
        case "percentage":
            return "%";
        default:
            return "";
    }
});
</script>

<template>
    <div class="text-6xl flex-1 flex items-center justify-center">
        <div class="flex gap-2 font-semibold">
            <div>{{ value }}</div>
            <div>{{ formatUi }}</div>
        </div>
    </div>
</template>
