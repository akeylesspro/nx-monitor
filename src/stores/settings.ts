import { defineStore } from "pinia";
import { computed, effect, ref } from "vue";
import { setState, type SetState } from "./helpers";
import moment from "moment-timezone";

export const useSettingsStore = defineStore(
    "settings",
    () => {
        const isMenuOpen = ref(false);
        const setIsMenuOpen: SetState<boolean> = (value) => setState(isMenuOpen, value);
        const currentLanguage = ref<"en" | "he">("en");
        const setCurrentLanguage: SetState<"en" | "he"> = (value) => setState(currentLanguage, value);
        const direction = computed(() => (currentLanguage.value === "en" ? "ltr" : "rtl"));
        const isRtl = computed(() => direction.value === "rtl");
        const userTimeZone = ref<string>("Asia/Jerusalem");
        effect(() => {
            const timeZone = moment.tz.guess();
            console.log("timeZone", timeZone);
            userTimeZone.value = timeZone;
        });
        return {
            isMenuOpen,
            setIsMenuOpen,
            currentLanguage,
            setCurrentLanguage,
            direction,
            isRtl,
            userTimeZone,
        };
    },
    {
        persist: {
            key: "settingsStore",
            storage: localStorage,
            omit: ["userTimeZone"],
        },
    }
);
