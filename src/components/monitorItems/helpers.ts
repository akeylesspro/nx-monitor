import { ChartUi, ListUi, TableUi, ValueUi } from "@/components";
import type { ItemData, ItemStatus, ItemValue, MetaItem, Thresholds } from "@/types";
import { getChartData, getListData, getTableData } from "./mockData";

/// return items meta list
export const getItemsMetaList = (pageName: string): MetaItem[] => {
    const res: MetaItem[] = [
        {
            title: "Chart",
            page_name: "home",
            type: "chart",
            format: "int",
            name: "chart",
        },
        {
            title: "Number Percentage",
            page_name: "home",
            type: "value",
            format: "percent",
            name: "number-percentage",
            value_thresholds: {
                yellow: 60,
                red: 80,
                critical: 90,
            },
        },
        {
            title: "Number int",
            page_name: "home",
            type: "value",
            format: "int",
            name: "number-int",
            value_thresholds: {
                yellow: 60,
                red: 70,
                critical: 80,
            },
        },
        {
            title: "Number decimal",
            page_name: "home",
            type: "value",
            format: "decimal",
            name: "number-decimal",
            value_thresholds: {
                yellow: 60,
                red: 70,
                critical: 80,
            },
        },
        {
            title: "Number currency",
            page_name: "home",
            type: "value",
            format: "currency",
            name: "number-currency",
            value_thresholds: {
                yellow: 60,
                red: 70,
                critical: 90,
            },
        },
        {
            title: "Table",
            page_name: "home",
            type: "table",
            format: "string",
            name: "table-data",
        },
        {
            title: "List",
            page_name: "home",
            type: "list",
            format: "string",
            name: "list-data",
        },
    ];
    return res.filter((item) => item.page_name === pageName);
};

/// return items data list
export const getItemsDataList = (metaList: MetaItem[]): Record<string, { value: ItemValue; updated: string }> => {
    return {
        "number-percentage": {
            value: 90,
            updated: "2025-01-01 16:50:00",
        },
        "number-int": {
            value: 50.6,
            updated: "2025-01-01 16:50:00",
        },
        "number-currency": {
            value: 80,
            updated: "2025-01-01 16:50:00",
        },
        "number-decimal": {
            value: 62.59,
            updated: "2025-01-01 16:50:00",
        },
        chart: {
            value: [
                {
                    label: "Jan",
                    value: 120,
                },
                {
                    label: "Feb",
                    value: 150,
                },
                {
                    label: "Mar",
                    value: 180,
                },
                {
                    label: "Apr",
                    value: 130,
                },
                {
                    label: "May",
                    value: 200,
                },
                {
                    label: "Jun",
                    value: 240,
                },
                {
                    label: "Jul",
                    value: 260,
                },
                {
                    label: "Aug",
                    value: 280,
                },
                {
                    label: "Sep",
                    value: 300,
                },
                {
                    label: "Oct",
                    value: 320,
                },
                {
                    label: "Nov",
                    value: 340,
                },
                {
                    label: "Dec",
                    value: 30,
                },
            ],
            updated: "2025-01-01 16:50:00",
        },
        "table-data": {
            value: getTableData() as any[],
            updated: "2025-01-01 16:50:00",
        },
        "list-data": {
            value: getListData(),
            updated: "2025-01-01 16:50:00",
        },
    };
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

export const getItemProps = (item: MetaItem, itemData: ItemData) => {
    if (!item || !itemData) {
        return null;
    }
    const { type, valueKeyRef } = item;
    const valueKey = valueKeyRef || "value";
    switch (type) {
        case "value":
            return {
                value: itemData[valueKey] as number,
                format: item.format,
            };
        case "chart":
            const chartData = getChartData(itemData[valueKey] as { label: string; value: number }[]);
            return {
                value: chartData,
            };
        case "table":
            return {
                value: itemData[valueKey] as any[],
            };
        case "list":
            return {
                value: itemData[valueKey] as string[],
            };
        default:
            return null;
    }
};

export const calculateStatus = (
    value: ItemValue,
    { valueThresholds, updatedThresholds }: { valueThresholds?: Thresholds; updatedThresholds?: Thresholds }
): ItemStatus => {
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
    return value.startsWith("http");
};
