export type ItemStatus = "success" | "error" | "warning" | "info" | "critical";

export type MetaType = "value" | "list" | "table" | "chart";

export type ItemFormat = "int" | "decimal" | "percent" | "currency" | "string";

export interface Title {
    title: string;
    url?: string;
}

export interface Thresholds {
    yellow?: number | string;
    red?: number | string;
    critical?: number | string;
}

export interface MetaItem {
    name: string;
    type: MetaType;
    page_name: string;
    format: ItemFormat;
    title: string;
    title_link?: string;
    valueKeyRef?: string;
    value_thresholds?: Thresholds;
    updated_thresholds?: Thresholds;
    status?: ItemStatus;
}

export type ItemValue = number | string | Record<string, any>[] | string[];

export type ItemData = {
    [key: string]: ItemValue;
};
