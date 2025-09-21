<script setup lang="ts">
import { toRefs } from "vue";
import { useSettingsStore } from "../stores";

const settings = useSettingsStore();

const props = defineProps<{ class?: string }>();
const { class: className } = toRefs(props);
</script>

<template>
    <div class="flex items-center gap-2 h-full" :class="className">
        <button
            class="h-full border border-[var(--color-border)] p-2 rounded-md hover:bg-[var(--color-hover)]"
            @click="settings.setCurrentLanguage((prev) => (prev === 'en' ? 'he' : 'en'))"
        >
            <img v-if="settings.currentLanguage === 'en'" src="/us-flag.png" alt="US Flag" class="h-4 w-6" />
            <img v-else src="/israel-flag.svg" alt="Israel Flag" class="h-4 w-6" />
        </button>
    </div>
</template>
