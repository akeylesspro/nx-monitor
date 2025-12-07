<script setup lang="ts">
import { toRefs } from "vue";
import { isHtmlTag, isLink } from "../helpers";
import { useCacheStore, useSettingsStore } from "@/stores";

const props = defineProps<{
    value: (string | number)[];
}>();

const { value } = toRefs(props);
const cacheStore = useCacheStore();
const settings = useSettingsStore();

const formatItem = (item: string | number): string => {
    if (typeof item === "number") {
        return formatNumber(item);
    }

    if (item.toString().includes("__:__")) {
        return formatTranslatedItem(item.toString());
    }

    return item;
};

const formatNumber = (num: number): string => {
    const rounded = Number(num.toFixed(0));
    return rounded.toLocaleString("en-US");
};

const formatTranslatedItem = (item: string): string => {
    const [key, value] = item.split("__:__");
    const translatedKey = cacheStore.getMonitorTranslations("list_item", key).value;
    console.log(translatedKey);
    return `${translatedKey} : ${value}`;
};
</script>

<template>
    <div class="h-full overflow-auto relative">
        <ul class="list-disc list-inside whitespace-nowrap" :style="{ direction: settings.direction }">
            <li v-for="item in value" :key="item" :style="{ direction: settings.direction }">
                <a v-if="isLink(item)" class="text-blue-600 underline" :href="String(item)" target="_blank">{{ item }}</a>
                <span v-else-if="isHtmlTag(item)" v-html="item"></span>
                <span v-else>{{ formatItem(item) }}</span>
            </li>
        </ul>
    </div>
</template>
