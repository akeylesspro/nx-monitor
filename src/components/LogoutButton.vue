<script setup lang="ts">
import { useSettingsStore, useUserStore } from "@/stores";
import { computed } from "vue";
const userStore = useUserStore();
const settings = useSettingsStore();

const { logout } = userStore;
const iconClass = computed(() => (settings.isRtl ? "fa-solid fa-arrow-left-from-bracket" : "fa-solid fa-arrow-right-from-bracket"));
</script>

<template>
    <div>
        <button :title="$t('common.logout')" class="px-3 h-9 rounded-md border border-[var(--color-border)]" @click="logout">
            <i :class="iconClass" class="text-sm" />
        </button>
    </div>
</template>
