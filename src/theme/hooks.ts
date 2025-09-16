import { computed, onMounted, ref, watch } from "vue";
import { THEME_OPTIONS, type ThemeMode } from "./config";
import { applyThemeAttribute, getThemeFromLocalStorage, saveThemeInLocalStorage } from "./helpers";

export const theme = ref<ThemeMode>(getThemeFromLocalStorage());
const media = typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)") : undefined;
const systemPrefersDark = ref<boolean>(media?.matches ?? false);

const isDark = computed<boolean>(() => theme.value === "dark");

let initializationDone = false;

export const useTheme = () => {
    const setTheme = (next: ThemeMode) => {
        theme.value = next;
        saveThemeInLocalStorage(next);
        applyThemeAttribute(next);
    };

    onMounted(() => {
        if (!initializationDone) {
            applyThemeAttribute(theme.value);
            const handler = (e: MediaQueryListEvent) => {
                systemPrefersDark.value = e.matches;
                if (theme.value === "system") {
                    applyThemeAttribute(isDark.value ? "dark" : "light");
                }
            };
            media?.addEventListener?.("change", handler);
            watch(theme, (next) => {
                saveThemeInLocalStorage(next);
                applyThemeAttribute(next);
            });
            initializationDone = true;
        } else {
            // Ensure attribute is in sync for late mount callers
            applyThemeAttribute(theme.value);
        }
    });

    return { theme, isDark, setTheme, THEME_OPTIONS };
};

export const useThemeColors = () => {
    return computed(() => {
        void theme.value;
        if (typeof window === "undefined" || typeof document === "undefined") {
            return {
                primaryColor: "#2563eb",
                secondaryColor: "#25deeb",
                textColor: "#0f172a",
                mutedColor: "#64748b",
                borderColor: "#e2e8f0",
                onPrimaryColor: "#ffffff",
                primaryTransparentColor: "#2563eb33",
            };
        }
        const style = getComputedStyle(document.documentElement);
        const readVar = (name: string, fallback: string) => {
            const value = style.getPropertyValue(name);
            const trimmed = (value || "").trim();
            return trimmed || fallback;
        };
        const primaryColor = readVar("--color-primary", "#2563eb");
        const secondaryColor = readVar("--color-secondary", "#25deeb");
        const textColor = readVar("--color-text", "#0f172a");
        const mutedColor = readVar("--color-muted", "#64748b");
        const borderColor = readVar("--color-border", "#e2e8f0");
        const onPrimaryColor = readVar("--color-on-primary", "#ffffff");
        const primaryTransparentColor = readVar("--color-primary-transparent", "#2563eb33");
        return { primaryColor, secondaryColor, textColor, mutedColor, borderColor, onPrimaryColor, primaryTransparentColor };
    });
};
