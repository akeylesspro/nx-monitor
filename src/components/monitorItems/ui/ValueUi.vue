<script setup lang="ts">
import { computed, toRefs } from "vue";
import type { ItemFormat, Thresholds } from "@/types";
import ThresholdUi from "../Wrapper/ThresholdUi.vue";

const props = defineProps<{
    value: number | string;
    format?: ItemFormat;
    valueThresholds?: Thresholds;
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
            return Number(Number(value.value).toFixed(0)).toLocaleString("en-US");
        case "decimal":
            return Number(value.value).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
        default:
            if (typeof value.value === "number") {
                return Number(value.value.toFixed(0)).toLocaleString("en-US");
            }
            return String(value.value);
    }
});
</script>

<template>
    <div class="text-6xl flex-1 flex items-center justify-center">
        <ThresholdUi :threshold="valueThresholds">
            <div :style="{ direction: formatUi ? 'ltr' : undefined }" class="flex gap-2 font-semibold">
                <div>{{ valueUi }}</div>
                <div v-if="formatUi">{{ formatUi }}</div>
            </div>
        </ThresholdUi>
    </div>
</template>
