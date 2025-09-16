import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { setState, type SetState } from "./helpers";

export const useSettingsStore = defineStore(
    "settings",
    () => {
        const isMenuOpen = ref(false);
        const setIsMenuOpen: SetState<boolean> = (value) => setState(isMenuOpen, value);
        const currentLanguage = ref<"en" | "he">("en");
        const setCurrentLanguage: SetState<"en" | "he"> = (value) => setState(currentLanguage, value);
        const direction = computed(() => (currentLanguage.value === "en" ? "ltr" : "rtl"));
        const isRtl = computed(() => direction.value === "rtl");
        return {
            isMenuOpen,
            setIsMenuOpen,
            currentLanguage,
            setCurrentLanguage,
            direction,
            isRtl,
        };
    },
    {
        persist: {
            key: "settings",
            storage: localStorage,
        },
    }
);
