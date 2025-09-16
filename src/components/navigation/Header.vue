<script setup lang="ts">
import { toRefs } from "vue";
import { cn } from "../../helpers";
import { useSettingsStore } from "../../stores";
import AkeylessLogo from "../AkeylessLogo.vue";
const { setIsMenuOpen } = useSettingsStore();
const props = defineProps<{
    class?: string;
    isMobile?: boolean;
}>();
const { class: className, isMobile } = toRefs(props);
</script>
<template>
    <div dir="ltr" :class="cn('border-b pb-4 border-[var(--color-border)] flex justify-between items-center gap-4', className)">
        <AkeylessLogo :class="cn(isMobile && `h-8`)" />
        <button v-if="isMobile" class="px-2 py-px rounded-md border" @click="setIsMenuOpen(false)">X</button>
    </div>
</template>
