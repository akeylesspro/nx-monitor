import { ChartUi, ListUi, TableUi, ValueUi } from "@/components";
import { timestampToMillis } from "@/helpers";
import { useSettingsStore } from "@/stores";
import type { DataItem, ItemStatus, ItemValue, MetaItem, MetaType, StringObject, Thresholds } from "@/types";
import { storeToRefs } from "pinia";

const parseChartData = (chartData: { label: string; value: number }[] = []) => {
    const result = {
        labels: chartData.map((item) => item.label),
        datasets: [
            {
                label: "",
                data: chartData.map((item) => item.value),
            },
        ],
    };
    return result;
};

export const getItemComponent = (item: MetaItem) => {
    switch (item.type) {
        case "value":
            return ValueUi;
        case "chart":
            return ChartUi;
        case "table":
            return TableUi;
        case "list":
            return ListUi;
        default:
            return null;
    }
};

export const getItemProps = (item: MetaItem, DataItem: DataItem) => {
    if (!item || !DataItem) {
        return null;
    }
    const { type, value_key_ref } = item;
    const valueKey = value_key_ref || "value";
    switch (type) {
        case "value":
            return {
                value: DataItem[valueKey] as number,
                format: item.format,
            };
        case "chart":
            const chartData = parseChartData(DataItem[valueKey] as { label: string; value: number }[]);
            return {
                value: chartData,
            };
        case "table":
            return {
                value: DataItem[valueKey] as any[],
            };
        case "list":
            return {
                value: DataItem[valueKey] as string[],
            };
        default:
            return null;
    }
};

const parseDurationToMillis = (threshold: string): number => {
    const match = /^\s*(\d{2}):(\d{2}):(\d{2}):(\d{2})\s*$/.exec(String(threshold));
    if (!match) return 0;
    const days = Number(match[1]);
    const hours = Number(match[2]);
    const minutes = Number(match[3]);
    const seconds = Number(match[4]);
    if ([days, hours, minutes, seconds].some((n) => Number.isNaN(n))) return 0;
    const totalSeconds = ((days * 24 + hours) * 60 + minutes) * 60 + seconds;
    return totalSeconds * 1000;
};

export const isUpdatedThresholdMet = (updatedAt: any, threshold: number | string | undefined): boolean => {
    const { userTimeZone } = storeToRefs(useSettingsStore());
    if (!threshold || !updatedAt) return false;
    const updatedMs = timestampToMillis(updatedAt, { tz: userTimeZone.value });
    if (!updatedMs) return false;
    const ageMs = Date.now() - updatedMs;
    if (typeof threshold === "number") {
        return ageMs >= threshold;
    }
    const thresholdMs = parseDurationToMillis(threshold);
    if (!thresholdMs) return false;
    return ageMs >= thresholdMs;
};

const isValueThresholdMet = (value: ItemValue | undefined, threshold: number | string | undefined): boolean => {
    if (!threshold) return false;
    const numericValue = Number(value);
    const isNumeric = !isNaN(numericValue);
    if (typeof threshold === "number") {
        return isNumeric && numericValue >= threshold;
    }

    return value === threshold;
};

const calculateArrayStatus = (array: (string | number)[], valueThresholds: Thresholds): ItemStatus => {
    let isHasError = false;
    let isHasWarning = false;
    for (const tableValue of array) {
        if (isValueThresholdMet(tableValue, valueThresholds?.critical)) {
            return "critical";
        }
        if (!isHasError && isValueThresholdMet(tableValue, valueThresholds?.red)) {
            isHasError = true;
            continue;
        }
        if (isValueThresholdMet(tableValue, valueThresholds?.yellow)) {
            isHasWarning = true;
        }
    }
    if (isHasError) {
        return "error";
    }
    if (isHasWarning) {
        return "warning";
    }

    return "success";
};

const getArrayStatus = (value: ItemValue | undefined, itemType: MetaType, valueThresholds: Thresholds | undefined): ItemStatus => {
    if (!valueThresholds) {
        return "info";
    }
    switch (itemType) {
        case "chart": {
            const chartValues = (value as StringObject[]).map((point) => point.value as number);
            return calculateArrayStatus(chartValues, valueThresholds);
        }
        case "table":
            const columnName = valueThresholds.column_name;
            if (!columnName) {
                return "info";
            }
            const columnValue = (value as StringObject[]).map((row) => row[columnName.toLowerCase()]);
            return calculateArrayStatus(columnValue, valueThresholds);
        case "list":
            return calculateArrayStatus(value as (string | number)[], valueThresholds);
        default:
            return "success";
    }
};

const getValueStatus = (value: string | number | undefined, valueThresholds: Thresholds | undefined): ItemStatus => {
    if (!valueThresholds) {
        return "success";
    }
    if (isValueThresholdMet(value, valueThresholds?.critical)) {
        return "critical";
    }
    if (isValueThresholdMet(value, valueThresholds?.red)) {
        return "error";
    }
    if (isValueThresholdMet(value, valueThresholds?.yellow)) {
        return "warning";
    }
    return "success";
};

export const calculateStatus = (
    value: ItemValue | undefined,
    itemType: MetaType,
    { valueThresholds }: { valueThresholds: Thresholds | undefined }
): ItemStatus => {
    if (!value) {
        console.error("Value is undefined", value);
        return "error";
    }

    if (Array.isArray(value)) {
        return getArrayStatus(value, itemType, valueThresholds);
    }

    return getValueStatus(value, valueThresholds);
};

export const isLink = (value: string) => {
    if (!value) return false;
    return String(value).startsWith("http");
};

export const isHtmlTag = (value: string) => {
    if (!value) return false;
    return String(value).startsWith("<") && String(value).endsWith(">");
};
