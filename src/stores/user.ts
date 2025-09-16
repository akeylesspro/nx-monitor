import { defineStore } from "pinia";
import { ref } from "vue";
import { setState, type SetState } from "./helpers";
import type { NxUser } from "akeyless-types-commons";

export const useUserStore = defineStore(
    "user",
    () => {
        const user = ref<NxUser | null>(null);
        const setUser: SetState<NxUser | null> = (value) => setState(user, value);

        return { user, setUser };
    },
    {
        persist: {
            key: "userStore",
            storage: localStorage,
            pick: [],
        },
    }
);
