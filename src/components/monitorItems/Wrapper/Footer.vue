<script setup lang="ts">
import { toRefs, ref, watch, onMounted, onUnmounted } from "vue";
import { timestampToMillis } from "@/helpers/times";
import { useI18n } from "vue-i18n";

const props = defineProps<{
    timestamp?: string;
}>();
const { timestamp } = toRefs(props);
const { t, locale } = useI18n();
const timePast = ref<string>("");
let intervalId: number | undefined;

const computeTimePastText = (ts: string | undefined): string => {
    if (!ts) return "";
    const tsMs = timestampToMillis(ts);
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
        return `${beforeText} ${hours} ${hoursText} ${andText} ${minutes} ${minutesText}`;
    }
    const days = Math.floor(diffMs / oneDay);
    const hours = Math.floor((diffMs % oneDay) / oneHour);
    return `${beforeText} ${days} ${daysText} ${andText} ${hours} ${hoursText}`;
};

const updateTimePast = () => {
    timePast.value = computeTimePastText(timestamp?.value);
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
</script>

<template>
    <div v-if="timestamp" class="w-full flex items-center gap-2 text-sm text-[gray]">
        <span dir="ltr">{{ timestamp }}</span>
        <span>-</span>
        <span>{{ timePast }}</span>
    </div>
</template>
