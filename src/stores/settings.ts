import { defineStore } from "pinia";
import { ref } from "vue";

export const useSettingsStore = defineStore(
    "settings",
    () => {
        const isMenuOpen = ref(false);

        function openMenu() {
            isMenuOpen.value = true;
        }

        function closeMenu() {
            isMenuOpen.value = false;
        }

        function toggleMenu() {
            isMenuOpen.value = !isMenuOpen.value;
        }

        return { isMenuOpen, openMenu, closeMenu, toggleMenu };
    },
    {
        persist: {
            key: "settings",
            storage: localStorage,
            pick: [],
        },
    }
);
