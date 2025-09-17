import { defineStore } from "pinia";
import { ref, computed, watch } from "vue";

export const THEME_OPTIONS = ["system", "light", "dark"] as const;
export type ThemeMode = (typeof THEME_OPTIONS)[number];

const applyThemeAttribute = (mode: ThemeMode) => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    if (mode === "system") {
        root.removeAttribute("data-theme");
        return;
    }
    root.setAttribute("data-theme", mode);
};

export const useThemeStore = defineStore(
    "themeStore",
    () => {
        const theme = ref<ThemeMode>("system");

        const activeTheme = computed(() => {
            if (theme.value !== "system") {
                return theme.value;
            }
            if (typeof window === "undefined") return "light";
            return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        });

        const themeColors = computed(() => {
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
            return {
                primaryColor: readVar("--color-primary", "#2563eb"),
                secondaryColor: readVar("--color-secondary", "#25deeb"),
                textColor: readVar("--color-text", "#0f172a"),
                mutedColor: readVar("--color-muted", "#64748b"),
                borderColor: readVar("--color-border", "#e2e8f0"),
                onPrimaryColor: readVar("--color-on-primary", "#ffffff"),
                primaryTransparentColor: readVar("--color-primary-transparent", "#2563eb33"),
            };
        });
        const initializeTheme = () => {
            if (typeof window === "undefined") return;

            applyThemeAttribute(theme.value);

            watch(theme, (newTheme) => {
                applyThemeAttribute(newTheme);
            });

            const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
            const handleSystemThemeChange = () => {
                if (theme.value === "system") {
                    applyThemeAttribute("system");
                }
            };
            mediaQuery.addEventListener("change", handleSystemThemeChange);
        };

        return {
            theme,
            activeTheme,
            themeColors,
            initializeTheme,
            THEME_OPTIONS,
        };
    },
    {
        persist: {
            key: "themeStore",
            storage: localStorage,
            pick: ["theme"],
        },
    }
);
