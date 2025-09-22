<script setup lang="ts">
import AkeylessLogo from "@/components/AkeylessLogo.vue";
import { PhoneLogin, EmailLogin, Switches } from "./";
</script>

<template>
    <div class="_full _center relative">
        <div class="absolute top-0 left-0 p-2 z-10 flex">
            <AkeylessLogo preventLink />
        </div>
        <div class="w-96 p-4 mx-4 shadow-lg rounded-lg border border-[var(--color-border)] flex flex-col gap-5">
            <PhoneLogin />
            <div class="w-full h-px bg-[var(--color-surface)]" />
            <EmailLogin />
            <div class="w-full h-px bg-[var(--color-surface)]" />
            <Switches />
        </div>
    </div>
</template>
