<script setup lang="ts">
import { ref, computed } from "vue";
import type { Thresholds } from "@/types";

const props = defineProps<{
    threshold: Thresholds | undefined;
}>();

const showTooltip = ref(false);

const hasThreshold = computed(() => {
    return (
        props.threshold && (props.threshold.warning !== undefined || props.threshold.error !== undefined || props.threshold.critical !== undefined)
    );
});
</script>

<template>
    <div class="relative inline-flex" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
        <slot />
        <div
            v-if="hasThreshold && showTooltip"
            class="absolute bottom-full left-0 mb-2 z-50 bg-gray-800 text-white px-3 py-2 rounded-md shadow-lg whitespace-nowrap"
        >
            <div class="text-xs space-y-1">
                <div class="font-semibold border-b border-gray-600 pb-1 mb-1">
                    {{ $t("common.direction") }}: {{ $t(`common.${threshold?.direction || "asc"}`) }}
                </div>
                <div v-if="threshold?.warning !== undefined" class="flex justify-between gap-3">
                    <span class="text-yellow-300">{{ $t("common.warning") }}:</span>
                    <span class="font-mono">{{ Number(threshold.warning).toLocaleString("en-US") }}</span>
                </div>
                <div v-if="threshold?.error !== undefined" class="flex justify-between gap-3">
                    <span class="text-red-400">{{ $t("common.error") }}:</span>
                    <span class="font-mono">{{ Number(threshold.error).toLocaleString("en-US") }}</span>
                </div>
                <div v-if="threshold?.critical !== undefined" class="flex justify-between gap-3">
                    <span class="text-red-600">{{ $t("common.critical") }}:</span>
                    <span class="font-mono">{{ Number(threshold.critical).toLocaleString("en-US") }}</span>
                </div>
            </div>
            <div
                class="absolute top-full left-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-gray-800"
            ></div>
        </div>
    </div>
</template>
