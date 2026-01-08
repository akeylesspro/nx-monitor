import { ChartUi, ListUi, TableUi, ValueUi } from "@/components";
import { timestampToMillis } from "@/helpers";
import { useSettingsStore } from "@/stores";
import type { DataItem, ItemStatus, ItemValue, MetaItem, MetaType, StringObject, Thresholds, ThresholdsDirection } from "@/types";
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
                valueThresholds: item.value_thresholds,
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

const parseDurationToMillis = (input: string): number => {
    if (!isDurationFormat(input)) {
        return 0;
    }
    const parts = input.split(":");
    const numbers = parts.map((p) => Number(p));
    if (numbers.some((n) => !Number.isFinite(n) || Number.isNaN(n) || n < 0)) {
        return 0;
    }

    let days = 0;
    let hours = 0;
    let minutes = 0;
    let seconds = 0;

    if (numbers.length === 4) {
        [days, hours, minutes, seconds] = numbers;
    } else if (numbers.length === 3) {
        [hours, minutes, seconds] = numbers;
    } else if (numbers.length === 2) {
        [minutes, seconds] = numbers;
    } else {
        [seconds] = numbers;
    }

    const total_seconds = ((days * 24 + hours) * 60 + minutes) * 60 + seconds;
    return total_seconds * 1000;
};

const isDurationFormat = (input: string): boolean => {
    if (typeof input !== "string" || !input.trim()) {
        return false;
    }
    const parts = input.split(":");
    if (parts.length < 1 || parts.length > 4) {
        return false;
    }
    return parts.every((part) => /^\d{1,2}$/.test(part));
};

export const isUpdatedThresholdMet = (
    updatedAt: any,
    threshold: number | string | undefined,
    direction: ThresholdsDirection | undefined = "asc"
): boolean => {
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
    return direction === "asc" ? ageMs >= thresholdMs : ageMs <= thresholdMs;
};

const isValueThresholdMet = (
    value: ItemValue | undefined,
    threshold: number | string | undefined,
    direction: ThresholdsDirection | undefined = "asc"
): boolean => {
    if (!threshold) return false;
    let numericValue = Number(value);
    if (typeof value === "string" && isDurationFormat(value)) {
        numericValue = parseDurationToMillis(value) / 1000;
    }
    const isNumeric = !isNaN(numericValue);
    if (typeof threshold === "number") {
        return isNumeric && (direction === "asc" ? numericValue >= threshold : numericValue <= threshold);
    }

    return value === threshold;
};

const calculateArrayStatus = (array: (string | number)[], valueThresholds: Thresholds): ItemStatus => {
    let isHasError = false;
    let isHasWarning = false;
    for (const tableValue of array) {
        if (isValueThresholdMet(tableValue, valueThresholds?.critical, valueThresholds?.direction)) {
            return "critical";
        }
        if (!isHasError && isValueThresholdMet(tableValue, valueThresholds?.error, valueThresholds?.direction)) {
            isHasError = true;
            continue;
        }
        if (isValueThresholdMet(tableValue, valueThresholds?.warning, valueThresholds?.direction)) {
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
    if (isValueThresholdMet(value, valueThresholds?.critical, valueThresholds?.direction)) {
        return "critical";
    }
    if (isValueThresholdMet(value, valueThresholds?.error, valueThresholds?.direction)) {
        return "error";
    }
    if (isValueThresholdMet(value, valueThresholds?.warning, valueThresholds?.direction)) {
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

export const isLink = (value: string | number) => {
    if (!value) return false;
    return String(value).startsWith("http");
};

export const isHtmlTag = (value: string | number) => {
    if (!value) return false;
    return String(value).startsWith("<") && String(value).endsWith(">");
};
