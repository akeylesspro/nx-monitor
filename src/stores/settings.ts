import { defineStore } from "pinia";
import { ref } from "vue";
import { setState, type SetState } from "./helpers";

export const useSettingsStore = defineStore(
    "settings",
    () => {
        const isMenuOpen = ref(false);
        const setIsMenuOpen: SetState<boolean> = (value) => setState(isMenuOpen, value);

        return { isMenuOpen, setIsMenuOpen };
    },
    {
        persist: {
            key: "settings",
            storage: localStorage,
            // pick: [],
        },
    }
);
