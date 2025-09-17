<script setup lang="ts">
import { computed, toRefs } from "vue";
import PrimeChart from "primevue/chart";
import { useThemeStore } from "../../stores";

type ChartType = "line" | "bar" | "doughnut" | "pie" | "radar" | "polarArea" | "bubble" | "scatter";
interface ChartProps {
    type?: ChartType;
    data: Record<string, unknown>;
    height?: number | string;
}

const props = defineProps<ChartProps>();

const { type, data } = toRefs(props);
const { themeColors } = toRefs(useThemeStore());

const gridColor = computed(() => {
    const color = "#000000";
    return color + "33";
});

const options = computed(() => {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: false,
        },
        scales: {
            x: {
                ticks: { color: "#000000" },
                grid: { color: gridColor.value },
            },
            y: {
                ticks: { color: "#000000" },
                grid: { color: gridColor.value },
            },
        },
    };
});

const themedData = computed(() => {
    const base: any = data.value as any;
    if (!base || typeof base !== "object") return base;
    const primary = themeColors.value.primaryColor;

    const themedDatasets = (base.datasets ?? []).map((ds: any) => ({
        ...ds,
        borderColor: ds?.borderColor ?? primary,
        backgroundColor: ds?.backgroundColor ?? primary,
        hoverBackgroundColor: ds?.hoverBackgroundColor ?? themeColors.value.secondaryColor,
    }));

    return { ...base, datasets: themedDatasets };
});
</script>

<template>
    <div class="flex-1 overflow-auto pe-2">
        <PrimeChart :type="type || 'bar'" :data="themedData" :options="options" class="_full" />
    </div>
</template>
