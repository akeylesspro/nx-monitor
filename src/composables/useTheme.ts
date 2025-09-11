import { computed, onMounted, ref, watch } from "vue";

const THEME_OPTIONS = ["system", "light", "dark", "akeyless"] as const;
export type ThemeMode = (typeof THEME_OPTIONS)[number];

const LOCAL_STORAGE_KEY = "app_theme_mode";

const getThemeFromLocalStorage = (): ThemeMode => {
    const value = localStorage.getItem(LOCAL_STORAGE_KEY) as ThemeMode | undefined;
    if (!value || !THEME_OPTIONS.includes(value)) return "system";
    return value;
};

const saveThemeInLocalStorage = (mode: ThemeMode) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, mode);
};

const applyThemeAttribute = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === "system") {
        root.removeAttribute("data-theme");
        return;
    }
    root.setAttribute("data-theme", mode);
};

export const useTheme = () => {
    const theme = ref<ThemeMode>(getThemeFromLocalStorage());

    const isDark = computed<boolean>(() => theme.value === "dark");

    const setTheme = (next: ThemeMode) => {
        theme.value = next;
        saveThemeInLocalStorage(next);
        applyThemeAttribute(next);
    };

    onMounted(() => {
        applyThemeAttribute(theme.value);
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => {
            if (theme.value === "system") applyThemeAttribute("system");
        };
        media.addEventListener?.("change", handler);
    });

    watch(theme, (next) => {
        saveThemeInLocalStorage(next);
        applyThemeAttribute(next);
    });

    return { theme, isDark, setTheme, THEME_OPTIONS };
};

export const initializeThemeFromStorage = () => {
    if (typeof document === "undefined") return;
    applyThemeAttribute(getThemeFromLocalStorage());
};
