import { computed, onMounted, ref, watch } from "vue";

const THEME_OPTIONS = ["system", "light", "dark", "akeyless"] as const;
export type ThemeMode = (typeof THEME_OPTIONS)[number];

const LOCAL_STORAGE_KEY = "app_theme_mode";
const storedMode = (): ThemeMode | null => {
    try {
        const value = localStorage.getItem(LOCAL_STORAGE_KEY) as ThemeMode;
        if (THEME_OPTIONS.includes(value)) return value;
        return null;
    } catch {
        return null;
    }
};

const saveMode = (mode: ThemeMode) => {
    try {
        localStorage.setItem(LOCAL_STORAGE_KEY, mode);
    } catch {
        // ignore
    }
};

const applyThemeAttribute = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === "system") {
        root.removeAttribute("data-theme");
        return;
    }
    root.setAttribute("data-theme", mode);
};

export const initializeThemeFromStorage = () => {
    if (typeof document === "undefined") return;
    const mode = storedMode() ?? "system";
    applyThemeAttribute(mode);
};

export const useTheme = () => {
    const mode = ref<ThemeMode>(storedMode() ?? "system");

    const isDark = computed<boolean>(() => mode.value === "dark");

    const setTheme = (next: ThemeMode) => {
        mode.value = next;
        saveMode(next);
        applyThemeAttribute(next);
    };

    const cycleTheme = () => {
        const idx = THEME_OPTIONS.indexOf(mode.value);
        const next = THEME_OPTIONS[(idx + 1) % THEME_OPTIONS.length];
        setTheme(next);
    };

    onMounted(() => {
        applyThemeAttribute(mode.value);
        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const handler = () => {
            if (mode.value === "system") applyThemeAttribute("system");
        };
        media.addEventListener?.("change", handler);
        // Fallback for older browsers
        media.addListener?.(handler);
    });

    watch(mode, (next) => {
        saveMode(next);
        applyThemeAttribute(next);
    });

    return { mode, isDark, setTheme, cycleTheme, THEME_OPTIONS };
};
