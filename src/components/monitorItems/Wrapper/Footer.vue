<script setup lang="ts">
import { toRefs, ref, watch, onMounted, onUnmounted, computed } from "vue";
import { timestampToMillis, timestampToString } from "@/helpers/times";
import { useI18n } from "vue-i18n";
import { useSettingsStore } from "@/stores";
import { storeToRefs } from "pinia";
import { isUpdatedThresholdMet } from "../helpers";
import type { Thresholds } from "@/types";

const props = defineProps<{
    timestamp?: any;
    updatedThreshold: Thresholds | undefined;
}>();
const { timestamp, updatedThreshold } = toRefs(props);
const { t, locale } = useI18n();
const timePast = ref<string>("");
let intervalId: number | undefined;
const { userTimeZone } = storeToRefs(useSettingsStore());

const computeTimePastText = (ts: string | undefined): string => {
    if (!ts) return "";
    const tsMs = timestampToMillis(ts, { tz: userTimeZone.value });
    const nowMs = Date.now();
    const diffMs = Math.max(0, nowMs - tsMs);
    const beforeText = t("common.before");
    const minutesText = t("common.minutes");
    const hoursText = t("common.hours");
    const daysText = t("common.days");
    const andText = t("common.and");
    const lessThanMinute = t("common.lessThanMinute");
    const oneMinute = 60_000;
    const oneHour = 60 * oneMinute;
    const oneDay = 24 * oneHour;

    if (diffMs < oneMinute) return lessThanMinute;
    if (diffMs < oneHour) {
        const minutes = Math.floor(diffMs / oneMinute);
        return `${beforeText} ${minutes} ${minutesText}`;
    }
    if (diffMs < oneDay) {
        const hours = Math.floor(diffMs / oneHour);
        const minutes = Math.floor((diffMs % oneHour) / oneMinute);
        const minutesLabel = minutes > 0 ? `${andText} ${minutes} ${minutesText}` : "";
        return `${beforeText} ${hours} ${hoursText} ${minutesLabel}`;
    }
    const days = Math.floor(diffMs / oneDay);
    const hours = Math.floor((diffMs % oneDay) / oneHour);
    const hoursLabel = hours > 0 ? `${andText} ${hours} ${hoursText}` : "";
    return `${beforeText} ${days} ${daysText} ${hoursLabel}`;
};
const updateTimePast = () => {
    timePast.value = computeTimePastText(timestampToString(timestamp.value, { tz: userTimeZone.value }));
};

watch(timestamp, updateTimePast);
watch(locale, updateTimePast);

onMounted(() => {
    updateTimePast();
    intervalId = window.setInterval(updateTimePast, 60_000);
});

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});
const textColor = computed(() => {
    if (!updatedThreshold.value) {
        return "text-[gray]";
    }
    if (
        isUpdatedThresholdMet(timestamp.value, updatedThreshold.value.critical) ||
        isUpdatedThresholdMet(timestamp.value, updatedThreshold.value.red)
    ) {
        return "text-red-700";
    }
    if (isUpdatedThresholdMet(timestamp.value, updatedThreshold.value.yellow)) {
        return "text-yellow-700";
    }
    return "text-[gray]";
});
</script>

<template>
    <div v-if="timestamp" class="w-full flex items-center gap-2 text-xs" :class="textColor">
        <span dir="ltr">{{ timestampToString(timestamp, { tz: userTimeZone }) }}</span>
        <span>-</span>
        <span>{{ timePast }}</span>
    </div>
</template>
