import { watch } from "vue";
import { useSettingsStore } from "../stores";
import { createI18nInstance, rtlLocales } from "./helpers";

export const setup = () => {
    const settingsStore = useSettingsStore();
    const i18n = createI18nInstance(settingsStore.currentLanguage);

    function applyDirAndLang(locale: string) {
        const isRtl = rtlLocales.includes(locale as any);
        document.documentElement.setAttribute("dir", isRtl ? "rtl" : "ltr");
        document.documentElement.setAttribute("lang", locale);
    }

    applyDirAndLang(settingsStore.currentLanguage);

    watch(
        () => settingsStore.currentLanguage,
        (newLocale) => {
            (i18n.global as any).locale.value = newLocale;
            applyDirAndLang(newLocale);
        },
        { immediate: false }
    );
    return i18n;
};
