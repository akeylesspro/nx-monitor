<script setup lang="ts">
import { toRefs } from "vue";

const props = defineProps<{
    timestamp?: string;
}>();
const { timestamp } = toRefs(props);
</script>

<template>
    <div v-if="timestamp" class="w-full flex items-center gap-2 text-sm text-[gray]">
        <span dir="ltr">{{ timestamp }}</span>
        <span>-</span>
        <span>לפני 50 שעות ו 10 דקות</span>
    </div>
</template>
