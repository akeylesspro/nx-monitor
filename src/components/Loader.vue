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
const borderColor = computed(() => {
    return color.value ? `border-[${color.value}]` : "border-[var(--color-primary)]";
});
const commonSpinnerClass = computed(() => {
    return cn("border-t-2 rounded-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2", borderColor.value, spinnerClass.value);
});
const commonSize = computed(() => {
    return size.value || 100;
});
</script>

<template>
    <div class="relative" :class="className">
        <div :class="cn('animate-spin animate-duration-1000', commonSpinnerClass)" :style="{ width: commonSize + 'px', height: commonSize + 'px' }"></div>
        <div
            v-if="twoSpinners"
            :class="cn('animate-spin-reverse', commonSpinnerClass)"
            :style="{ width: commonSize * 0.8 + 'px', height: commonSize * 0.8 + 'px' }"
        />
    </div>
</template>
