import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { setState, type SetState } from "./helpers";

export const useMainStore = defineStore(
    "main",
    () => {
        const name = ref("Eduardo");
        const setName: SetState<string> = (value) => setState(name, value);
        const count = ref(0);
        const setCount: SetState<number> = (value) => setState(count, value);
        const doubleCount = computed(() => count.value * 2);
        function increment() {
            count.value++;
        }

        return { count, name, doubleCount, increment, setName, setCount };
    },
    {
        persist: {
            key: "main",
            storage: localStorage,
            pick: [],
        },
    }
);
