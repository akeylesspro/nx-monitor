<script setup lang="ts">
import { computed, toRefs } from "vue";
import PrimeChart from "primevue/chart";
import { useSettingsStore } from "../stores/settings";

type ChartType = "line" | "bar" | "doughnut" | "pie" | "radar" | "polarArea" | "bubble" | "scatter";
interface ChartProps {
    type?: ChartType;
    data: Record<string, unknown>;
    title?: string;
    height?: number | string;
}

const props = defineProps<ChartProps>();

const { type, data } = toRefs(props);
const { themeColors } = toRefs(useSettingsStore());

const gridColor = computed(() => {
    const color = themeColors.value.textColor;
    return color + "33";
});

const options = computed(() => {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: {
                    color: themeColors.value.textColor,
                },
            },

            title: props.title
                ? {
                      display: true,
                      text: props.title,
                      color: themeColors.value.textColor,
                  }
                : undefined,
        },
        scales: {
            x: {
                ticks: { color: themeColors.value.textColor },
                grid: { color: gridColor.value },
            },
            y: {
                ticks: { color: themeColors.value.textColor },
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
    <PrimeChart :type="type || 'bar'" :data="themedData" :options="options" class="h-full w-full overflow-auto" />
</template>
