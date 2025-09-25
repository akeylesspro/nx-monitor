import { defineStore } from "pinia";
import { computed, ref, effect } from "vue";
import { setState, type SetState } from "./helpers";
import type { NxUser } from "akeyless-types-commons";
import { jwtDecode } from "jwt-decode";
import { getUserByIdentifier, createExpiringStorage } from "@/helpers";

export const useUserStore = defineStore(
    "user",
    () => {
        const token = ref<string>("");
        const setToken: SetState<string> = (value) => setState(token, value);
        const user = ref<NxUser | null>(null);
        const setUser: SetState<NxUser | null> = (value) => setState(user, value);
        const isLoggedIn = computed(() => Boolean(user.value) && Boolean(user.value!.clients));
        const logout = () => {
            setToken("");
            setUser(null);
        };
        effect(async () => {
            if (!token.value || user) {
                return;
            }
            const result = getUserByToken(token.value);
            const userResult = await getUserByIdentifier(result.email || result.phone_number || "");
            setUser(userResult);
        });
        return { token, setToken, user, setUser, isLoggedIn, logout };
    },
    {
        persist: {
            key: "userStore",
            storage: createExpiringStorage({ ttlMs: 7 * 24 * 60 * 60 * 1000 }),
            pick: ["token", "user"],
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
