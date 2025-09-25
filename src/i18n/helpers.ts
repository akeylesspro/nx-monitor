import { createI18n } from "vue-i18n";

export type LanguageOption = "en" | "he";

const messages = {
    en: {
        common: {
            home: "Home",
            about: "About",
            test: "Test",
            traffic: "Traffic",
            updated: "Updated",
            phoneNumber: "Phone Number",
            sendCode: "Send Code",
            loginWithPhone: "Login with phone number",
            loginWithEmail: "Login with email",
            login: "Login",
            logout: "Logout",
            verifyCode: "Verify Code",
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
            about: "אודות",
            test: "בדיקה",
            traffic: "תנועה",
            updated: "עודכן",
            phoneNumber: "מספר טלפון",
            sendCode: "שלח קוד",
            loginWithPhone: "התחברות עם מספר טלפון",
            loginWithEmail: "התחברות עם אימייל",
            login: "התחברות",
            logout: "התנתקות",
            verifyCode: "אימות קוד",
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
