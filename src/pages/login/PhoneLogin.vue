<script setup lang="ts">
import { ref } from "vue";
import { useRouter } from "vue-router";

const phoneValue = ref("");
const router = useRouter();
const handleSubmit = () => {
    router.push("/");
};
const onChange = (event: Event) => {
    const input = event.target as HTMLInputElement;
    input.value = input.value.replace(/[^0-9+]/g, "");
    phoneValue.value = input.value;
};
</script>

<template>
    <form @submit.prevent="handleSubmit" class="flex flex-col gap-2">
        <label class="text-xl font-bold">{{ $t("common.loginWithPhone") }}</label>
        <input
            :value="phoneValue"
            @input="onChange"
            inputmode="numeric"
            type="tel"
            class="w-full p-2 rounded-lg border border-[var(--color-border)] hover"
        />

        <button type="submit" class="w-full p-2 rounded-lg border border-[var(--color-border)]">
            {{ $t("common.sendCode") }}
        </button>
    </form>
</template>
