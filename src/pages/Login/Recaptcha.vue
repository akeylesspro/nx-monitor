<script setup lang="ts">
import { auth } from "@/helpers";
import { RecaptchaVerifier } from "firebase/auth";
import { onMounted } from "vue";
onMounted(() => {
    const recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha", {
        size: "invisible",
    });
    window.recaptchaVerifier = recaptchaVerifier;
});
</script>

<template>
    <div :style="{ display: 'none' }" id="recaptcha"></div>
</template>
