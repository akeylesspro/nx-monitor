<script setup lang="ts">
import { toRefs } from "vue";
import { useSettingsStore } from "../stores";

const settings = useSettingsStore();

const props = defineProps<{ class?: string }>();
const { class: className } = toRefs(props);
</script>

<template>
    <div class="flex items-center gap-2 h-full" :class="className">
        <button class="h-full" @click="settings.setCurrentLanguage((prev) => (prev === 'en' ? 'he' : 'en'))">
            <img v-if="settings.currentLanguage === 'en'" src="/us-flag.svg" alt="US Flag" />
            <img v-else src="/israel-flag.svg" alt="Israel Flag" />
        </button>
    </div>
</template>
