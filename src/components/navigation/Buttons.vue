<script setup lang="ts">
import { useCacheStore } from "@/stores";
import { NavButton } from ".";
import { toRefs } from "vue";
import { storeToRefs } from "pinia";

const props = defineProps<{
    class?: string;
}>();
const { class: className } = toRefs(props);
const { pages, getMonitorTranslations } = storeToRefs(useCacheStore());
</script>

<template>
    <div class="overflow-auto flex-1 flex flex-col gap-1 px-2 py-4" :class="className">
        <NavButton to="/" :label="$t('common.home')" />
        <NavButton v-for="page in pages" :key="page" :to="`/${page}`" :label="getMonitorTranslations('page_name', page).value" />
    </div>
</template>
