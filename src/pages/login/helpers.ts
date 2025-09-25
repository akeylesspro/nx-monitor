import { auth, getUserByEmail, getUserByIdentifier, googleLoginProvider } from "@/helpers";
import { useUserStore } from "@/stores";
import { signInWithPhoneNumber, signInWithPopup } from "firebase/auth";

export const signInWithGoogle = async (): Promise<boolean> => {
    const result = await signInWithPopup(auth, googleLoginProvider);
    const user = result.user;
    if (!user) {
        throw new Error("userNotFound");
    }
    const token = await user.getIdToken();
    if (!token) {
        throw new Error("tokenNotFound");
    }

    const nxUser = await getUserByEmail(user.email || "");
    if (!nxUser) {
        throw new Error("userNotFound");
    }
    const userStore = useUserStore();
    const { setToken } = userStore;
    setToken(token);
    return true;
};

export const signInWithPhone = async (phone: string) => {
    const isInternational = phone.startsWith("+");
    const phoneNumber = isInternational ? phone : `+972${phone.slice(1)}`;
    const appVerifier = window.recaptchaVerifier;
    const user = await getUserByIdentifier(phoneNumber);
    if (!user) {
        throw new Error("userNotFound");
    }

    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
    window.confirmationResult = confirmationResult;
    return true;
};

export const verifyCode = async (code: string) => {
    const confirmationResult = window.confirmationResult;
    let token: string = "";
    try {
        const result = await confirmationResult.confirm(code);
        token = await result.user.getIdToken();
    } catch (error) {
        throw new Error("codeNotValid");
    }
    if (!token) {
        throw new Error("tokenNotFound");
    }
    const userStore = useUserStore();
    const { setToken } = userStore;
    setToken(token);
    return true;
};
