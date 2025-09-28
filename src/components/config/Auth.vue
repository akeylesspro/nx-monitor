<script setup lang="ts">
import { auth, socketServiceInstance } from "@/helpers";
import { useUserStore } from "@/stores";
import { onIdTokenChanged } from "firebase/auth";
import { onMounted, onUnmounted, ref } from "vue";

const unsubscribe = ref<() => void>();
const { logout, setToken } = useUserStore();

onMounted(() => {
    unsubscribe.value = onIdTokenChanged(auth, async (user) => {
        if (user) {
            const token = await user.getIdToken();
            setToken(token);
            socketServiceInstance.startSession(token);
        } else {
            logout();
        }
    });
});

onUnmounted(() => {
    unsubscribe.value?.();
});

</script>

<template></template>
