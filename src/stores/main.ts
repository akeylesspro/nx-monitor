import { defineStore } from "pinia";
import { ref } from "vue";
import { setState, type SetState } from "./helpers";

export const useMainStore = defineStore(
    "main",
    () => {
        const name = ref("Eduardo");
        const setName: SetState<string> = (value) => setState(name, value);

        return { name, setName };
    },
    {
        persist: {
            key: "main",
            storage: localStorage,
            pick: [],
        },
    }
);
