<script setup lang="ts">
import { storeToRefs } from "pinia";
import Layout from "./Layout.vue";
import { useUserStore } from "@/stores";
import { LoginPage } from "./pages/login";
const userStore = useUserStore();
const { isLoggedIn } = storeToRefs(userStore);
</script>

<template>
    <Layout v-if="isLoggedIn && $route.path !== '/login'" />
    <LoginPage v-else />
</template>
