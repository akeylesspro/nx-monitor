<script setup lang="ts">
import { effect, ref } from "vue";
import { useRouter } from "vue-router";
import InputOtp from "@/volt/InputOtp.vue";
import { signInWithPhone, verifyCode } from "./helpers";
import { useI18n } from "vue-i18n";
import Loader from "@/components/Loader.vue";
import type { NxUser } from "akeyless-types-commons";

const phoneValue = ref("");
const codeValue = ref("");
const errorMessage = ref("");
const showCode = ref(false);
const isLoading = ref(false);
const router = useRouter();
const databaseUser = ref<NxUser | null>(null);
const handleSubmit = async () => {
    try {
        isLoading.value = true;
        if (showCode.value) {
            await verifyCode(codeValue.value, databaseUser.value!);
            router.push("/");
        } else {
            const user = await signInWithPhone(phoneValue.value);
            databaseUser.value = user;
            showCode.value = true;
        }
    } catch (error: any) {
        errorMessage.value = error.message || error;
    } finally {
        isLoading.value = false;
    }
};
const onPhoneInputChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9+]/g, "");
    phoneValue.value = input.value;
};
effect(() => {
    if (codeValue.value.length === 6) {
        handleSubmit();
    }
});
</script>

<template>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-3">
        <label class="text-xl font-bold">{{ $t("common.loginWithPhone") }}</label>
        <input
            v-if="!showCode"
            :value="phoneValue"
            @input="onPhoneInputChange"
            inputmode="numeric"
            maxlength="14"
            type="tel"
            class="w-full p-2 rounded-lg border border-[var(--color-border)] hover"
        />
        <InputOtp v-else v-model="codeValue" :length="6" dir="ltr" class="flex justify-center animate-flipright animate-duration-300" />

        <button :disabled="isLoading || phoneValue.length < 10" type="submit" class="w-full p-2 rounded-lg border border-[var(--color-border)]">
            <Loader class="h-6" v-if="isLoading" :size="20" />
            <span v-else-if="showCode">
                {{ $t("common.verifyCode") }}
            </span>
            <span v-else>
                {{ $t("common.sendCode") }}
            </span>
        </button>
        <div v-if="errorMessage" class="text-red-500">{{ $t(`errors.${errorMessage}`) }}</div>
    </form>
</template>
