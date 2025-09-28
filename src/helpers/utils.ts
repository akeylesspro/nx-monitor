import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]): string {
    return twMerge(clsx(inputs));
}

export const localIsraelPhoneFormat = (internationalNumber: string) => {
    return internationalNumber.replace("+972", "0");
};

export interface ExpiringStorageOptions {
    ttlMs: number;
    now?: () => number;
}

export const createExpiringStorage = (options: ExpiringStorageOptions) => {
    const now = options.now ?? Date.now;
    const ttlMs = options.ttlMs;

    const buildPayload = (value: string) => JSON.stringify({ v: value, t: now() });
    const parsePayload = (raw: string | null) => {
        if (!raw) return null;
        try {
            const parsed = JSON.parse(raw) as { v: string; t: number };
            if (typeof parsed?.t !== "number" || typeof parsed?.v !== "string") return null;
            const isExpired = now() - parsed.t > ttlMs;
            return isExpired ? null : parsed.v;
        } catch {
            return null;
        }
    };

    return {
        getItem(key: string): string | null {
            const raw = localStorage.getItem(key);
            const value = parsePayload(raw);
            if (value === null && raw !== null) {
                localStorage.removeItem(key);
            }
            return value;
        },
        setItem(key: string, value: string): void {
            localStorage.setItem(key, buildPayload(value));
        },
        removeItem(key: string): void {
            localStorage.removeItem(key);
        },
    } as Pick<Storage, "getItem" | "setItem" | "removeItem">;
};

export const { mode, isLocal } = {
    mode: import.meta.env.VITE_MODE,
    isLocal: import.meta.env.VITE_IS_LOCAL === "true",
};
