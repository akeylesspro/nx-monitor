export const THEME_OPTIONS = ["system", "light", "dark", "akeyless"] as const;

export type ThemeMode = (typeof THEME_OPTIONS)[number];

export const LOCAL_STORAGE_KEY = "app_theme_mode";
