import { createI18n } from "vue-i18n";

export type LanguageOption = "en" | "he";

const messages = {
    en: {
        common: {
            home: "Home",
            about: "About",
            test: "Test",
            traffic: "Traffic",
        },
    },
    he: {
        common: {
            home: "בית",
            about: "אודות",
            test: "בדיקה",
            traffic: "תנועה",
        },
    },
};

export function createI18nInstance(currentLanguage: LanguageOption) {
    return createI18n({
        legacy: false,
        globalInjection: true,
        locale: currentLanguage,
        fallbackLocale: "he",
        messages,
    });
}

export const rtlLocales: LanguageOption[] = ["he"];
