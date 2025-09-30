<script setup lang="ts">
import { toRefs } from "vue";

const props = defineProps<{
    title: string;
    url?: string;
}>();
const { title, url } = toRefs(props);
</script>

<template>
    <div class="w-full flex items-end gap-2 text-2xl font-bold">
        <a v-if="url" class="text-blue-600 underline" :href="url" target="_blank">{{ title }}</a>
        <span v-else>{{ title }}</span>
    </div>
</template>
