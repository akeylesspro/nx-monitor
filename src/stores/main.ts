import { defineStore } from "pinia";
import { ref } from "vue";
import { setState, type SetState } from "./helpers";

export const useMainStore = defineStore(
    "main",
    () => {
        const name = ref("avi");
        const setName: SetState<string> = (value) => setState(name, value);

        return { name, setName };
    },
    {
        persist: {
            key: "mainStore",
            storage: localStorage,
            pick: [],
        },
    }
);
