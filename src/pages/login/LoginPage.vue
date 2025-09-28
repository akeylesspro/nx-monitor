<script setup lang="ts">
import AkeylessLogo from "@/components/AkeylessLogo.vue";
import { GoogleLogin, Switches } from "./";
</script>

<template>
    <div class="_full _center">
        <div class="w-96 p-4 mx-4 shadow-lg rounded-lg border border-[var(--color-border)] flex flex-col gap-4">
            <AkeylessLogo preventLink />
            <div class="w-full h-px bg-[var(--color-surface)]" />
            <GoogleLogin />
            <div class="w-full h-px bg-[var(--color-surface)]" />
            <Switches />
        </div>
    </div>
</template>
