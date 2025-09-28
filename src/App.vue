<script setup lang="ts">
import { storeToRefs } from "pinia";
import { Loader, Version } from "./components";
import Layout from "./Layout.vue";
import { LoginPage, Recaptcha } from "./pages/Login";
import { useUserStore } from "./stores";

const userStore = useUserStore();
const { isLoggedIn, token } = storeToRefs(userStore);
</script>

<template>
    <div v-if="token && !isLoggedIn" class="_full _center">
        <Loader :size="200" twoSpinners />
    </div>
    <Layout v-else-if="isLoggedIn && $route.path !== '/login'" />
    <LoginPage v-else />
    <Recaptcha />
    <Version />
</template>
