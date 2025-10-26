<script setup lang="ts">
import { toRefs, ref, watch, onMounted, onUnmounted, computed } from "vue";
import { timestampToMillis, timestampToString } from "@/helpers/times";
import { useI18n } from "vue-i18n";
import { useSettingsStore, useUserStore } from "@/stores";
import { storeToRefs } from "pinia";
import { isUpdatedThresholdMet } from "../helpers";
import type { Thresholds } from "@/types";
import axios from "axios";
import ThresholdUi from "./ThresholdUi.vue";

const props = defineProps<{
    timestamp?: any;
    updatedThreshold: Thresholds | undefined;
    cron: string | undefined;
    name: string;
}>();

const { timestamp, updatedThreshold, cron, name } = toRefs(props);
const { t, locale } = useI18n();
const timePast = ref<string>("");
const userStore = useUserStore();
const isLoading = ref(false);
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

const reRunTask = async () => {
    try {
        isLoading.value = true;
        const res = await axios.post(
            `https://nx-api.info/api/bi/monitor/tasks/run`,
            {
                task_name: name.value,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userStore.token}`,
                },
            }
        );
        console.log("Task re-run response", res.data.data);
    } catch (error) {
        console.error("Error re-running task", error);
    } finally {
        isLoading.value = false;
    }
};
const textColor = computed(() => {
    if (!updatedThreshold.value) {
        return "";
    }
    if (isUpdatedThresholdMet(timestamp.value, updatedThreshold.value.critical, updatedThreshold.value.direction)) {
        return "_critical-blink-footer";
    }
    if (isUpdatedThresholdMet(timestamp.value, updatedThreshold.value.error, updatedThreshold.value.direction)) {
        return "bg-red-400 ";
    }
    if (isUpdatedThresholdMet(timestamp.value, updatedThreshold.value.warning, updatedThreshold.value.direction)) {
        return "bg-yellow-400 ";
    }
    return "";
});
</script>

<template>
    <div v-if="timestamp" class="text-xs flex justify-between">
        <ThresholdUi :threshold="updatedThreshold">
            <div class="flex items-center gap-2 rounded-md px-2 pb-px" :class="textColor">
                <span dir="ltr">{{ timestampToString(timestamp, { tz: userTimeZone }) }}</span>
                <span>-</span>
                <span>{{ timePast }}</span>
            </div>
        </ThresholdUi>
        <button @click="reRunTask" v-if="cron" class="border border-black px-2 py-1 rounded-sm hover:bg-gray-300" :title="t('common.reRunTask')">
            <i class="fa-regular fa-rotate-right" :class="isLoading ? 'animate-spin' : ''" />
        </button>
    </div>
</template>
