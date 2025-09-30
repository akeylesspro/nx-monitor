<script setup lang="ts">
import { useCacheStore } from "@/stores";
import { storeToRefs } from "pinia";
import { toRefs } from "vue";

const props = defineProps<{
    title: string;
    url?: string;
}>();

const { title, url } = toRefs(props);
const { getMonitorTranslations } = storeToRefs(useCacheStore());
</script>

<template>
    <div class="w-full flex items-end gap-2 text-2xl font-bold">
        <a v-if="url" class="text-blue-600 underline" :href="url" target="_blank">{{ getMonitorTranslations("item_title", title) }}</a>
        <span v-else>{{ getMonitorTranslations("item_title", title) }}</span>
    </div>
</template>
