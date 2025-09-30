import { createI18n } from "vue-i18n";

export type LanguageOption = "en" | "he";

const messages = {
    en: {
        common: {
            home: "Home",
            phoneNumber: "Phone Number",
            sendCode: "Send Code",
            loginWithPhone: "Login with phone number",
            loginWith: "Login with",
            login: "Login",
            logout: "Logout",
            verifyCode: "Verify Code",
            before: "Before",
            minutes: "Minutes",
            hours: "Hours",
            days: "Days",
            and: "and",
            lessThanMinute: "Less than minute",
        },
        errors: {
            userNotFound: "User not found",
            tokenNotFound: "Token not found",
            codeNotValid: "Code not valid",
        },
    },
    he: {
        common: {
            home: "בית",
            phoneNumber: "מספר טלפון",
            sendCode: "שלח קוד",
            loginWithPhone: "התחברות עם מספר טלפון",
            loginWith: "התחברות עם",
            login: "התחברות",
            logout: "התנתקות",
            verifyCode: "אימות קוד",
            before: "לפני",
            minutes: "דקות",
            hours: "שעות",
            days: "ימים",
            and: "ו",
            lessThanMinute: "פחות מדקה",
        },
        errors: {
            userNotFound: "משתמש לא נמצא",
            tokenNotFound: "טוקן לא נמצא",
            codeNotValid: "קוד לא תקין",
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
