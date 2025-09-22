import { defineStore } from "pinia";
import { computed, ref, effect } from "vue";
import { setState, type SetState } from "./helpers";
import type { NxUser } from "akeyless-types-commons";
import { jwtDecode } from "jwt-decode";

export const useUserStore = defineStore(
    "user",
    () => {
        const token = ref<string>("");
        const setToken: SetState<string> = (value) => setState(token, value);
        const user = ref<NxUser | null>(null);
        const setUser: SetState<NxUser | null> = (value) => setState(user, value);
        const isLoggedIn = computed(() => true);
        // const isLoggedIn = computed(() => Boolean(user.value) && Boolean(user.value!.clients));
        effect(() => {
            if (token.value) {
                const result = getUserByToken(token.value);
                console.log("token result", result);
                // setUser(result);
                return;
            }
            console.log("no token");
        });
        return { token, setToken, user, setUser, isLoggedIn };
    },
    {
        persist: {
            key: "userStore",
            storage: localStorage,
            pick: ["token"],
        },
    }
);

export interface DecodedUser {
    user_id: string;
    phone_number?: string;
    email?: string;
}
const getUserByToken = (token: string) => {
    const user = jwtDecode<DecodedUser>(token);
    const userResult: NxUser = {};
    userResult.id = user.user_id;
    if (user.phone_number) {
        userResult.phone_number = user.phone_number;
    }
    if (user.email) {
        userResult.email = user.email;
    }
    return userResult;
};
