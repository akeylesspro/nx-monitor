import type { Timestamp } from "firebase/firestore";

export interface StringObject<T = any> {
    [key: string]: T;
}

export type ItemStatus = "info" | "success" | "warning" | "error" | "critical";

export type MetaType = "value" | "list" | "table" | "chart";

export type ItemFormat = "int" | "decimal" | "percent" | "currency" | "string";

export type ThresholdsDirection = "asc" | "desc";

export interface Title {
    title: string;
    url?: string;
}

export interface Thresholds {
    column_name?: string;
    direction?: ThresholdsDirection;
    warning?: number | string;
    error?: number | string;
    critical?: number | string;
}

export interface NotificationItem {
    to?: string[];
    template?: string;
    last_sent_timestamp?: Timestamp;
    interval_seconds?: number;
}

export type NotificationChannel = "sms" | "email";

export type NotificationChannels = Partial<Record<NotificationChannel, NotificationItem>>;

export type NotificationStatus = Exclude<ItemStatus, "info" | "success">;

export type StatusNotificationChannels = Partial<Record<NotificationStatus, NotificationChannels>>;

export type NotificationTriggeredBy = "on_value_thresholds_options" | "on_updated_thresholds_options";

export type NotificationsOptions = Partial<Record<NotificationTriggeredBy, StatusNotificationChannels>>;

export interface Notification {
    value?: NotificationOptions;
    updated?: NotificationOptions;
}

export interface MetaItem {
    name: string;
    type: MetaType;
    pages: string[];
    format: ItemFormat;
    title: string;
    title_link?: string;
    cron?: string;
    value_key_ref?: string;
    value_thresholds?: Thresholds;
    updated_thresholds?: Thresholds;
    status?: ItemStatus;
    notification?: Notification;
}

export type ItemValue = number | string | Record<string, any>[] | string[];

export type DataItem = {
    [key: string]: ItemValue;
};
