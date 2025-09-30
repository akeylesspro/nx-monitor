import { ChartUi, ListUi, TableUi, ValueUi } from "@/components";
import type { DataItem, ItemStatus, ItemValue, MetaItem, Thresholds } from "@/types";

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

export const calculateStatus = (
    value: ItemValue | undefined,
    { valueThresholds, updatedThresholds }: { valueThresholds?: Thresholds; updatedThresholds?: Thresholds },
): ItemStatus => {
    if (!value) {
        console.error("Value is undefined", value);
        return "error";
    }
    const numericValue = Number(value);
    const isNumeric = !isNaN(numericValue);
    if (Array.isArray(value)) {
        return "info";
    }
    const isThresholdMet = (threshold: number | string | undefined): boolean => {
        if (!threshold) return false;

        if (typeof threshold === "number") {
            return isNumeric && numericValue >= threshold;
        }

        return value === threshold;
    };

    if (isThresholdMet(valueThresholds?.critical) || isThresholdMet(updatedThresholds?.critical)) {
        return "critical";
    }

    if (isThresholdMet(valueThresholds?.red) || isThresholdMet(updatedThresholds?.red)) {
        return "error";
    }

    if (isThresholdMet(valueThresholds?.yellow) || isThresholdMet(updatedThresholds?.yellow)) {
        return "warning";
    }

    return "success";
};

export const isLink = (value: string) => {
    if (!value) return false;
    return String(value).startsWith("http");
};

const parseChartData = (mockData: { label: string; value: number }[] = []) => {
    const chartData = {
        labels: mockData.map((item) => item.label),
        datasets: [
            {
                label: "",
                data: mockData.map((item) => item.value),
            },
        ],
    };
    return chartData;
};
