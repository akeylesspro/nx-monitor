import { LOCAL_STORAGE_KEY, THEME_OPTIONS, type ThemeMode } from "./config";

export const getThemeFromLocalStorage = (): ThemeMode => {
    const value = localStorage.getItem(LOCAL_STORAGE_KEY) as ThemeMode | undefined;
    if (!value || !THEME_OPTIONS.includes(value)) return "system";
    return value;
};

export const saveThemeInLocalStorage = (mode: ThemeMode) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, mode);
};

export const applyThemeAttribute = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === "system") {
        root.removeAttribute("data-theme");
        return;
    }
    root.setAttribute("data-theme", mode);
};

export const initializeThemeFromStorage = () => {
    if (typeof document === "undefined") return;
    applyThemeAttribute(getThemeFromLocalStorage());
};
