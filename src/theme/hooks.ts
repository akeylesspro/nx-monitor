import { computed, onMounted, ref, watch } from "vue";
import { THEME_OPTIONS, type ThemeMode } from "./config";
import { applyThemeAttribute, getThemeFromLocalStorage, saveThemeInLocalStorage } from "./helpers";

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
