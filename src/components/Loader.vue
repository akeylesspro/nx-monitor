<script setup lang="ts">
import { cn } from "@/helpers";
import { computed, toRefs } from "vue";

const props = defineProps<{
    size?: number;
    color?: string;
    class?: string;
    spinnerClass?: string;
    twoSpinners?: boolean;
}>();
const { size, color, class: className, spinnerClass, twoSpinners } = toRefs(props);

const commonSize = computed(() => size.value || 100);

const getSpinnerStyle = (multiplier = 1) => {
    const sizeValue = commonSize.value * multiplier;
    const borderColorValue = color.value || "var(--color-primary)";
    return {
        width: `${sizeValue}px`,
        height: `${sizeValue}px`,
        borderTopColor: borderColorValue,
    };
};
const commonSpinnerClass = computed(() => {
    return cn("rounded-full absolute border-t-2 ", spinnerClass.value);
});
</script>

<template>
    <div class="relative inline-flex items-center justify-center" :class="className" :style="{ width: commonSize + 'px', height: commonSize + 'px' }">
        <div :class="cn('animate-spin ', commonSpinnerClass)" :style="getSpinnerStyle(1)"></div>
        <div v-if="twoSpinners" :class="cn('animate-spin-reverse ', commonSpinnerClass)" :style="getSpinnerStyle(0.8)" />
    </div>
</template>
