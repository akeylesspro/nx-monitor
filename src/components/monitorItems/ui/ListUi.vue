<script setup lang="ts">
import { toRefs } from "vue";
import { isHtmlTag, isLink } from "../helpers";

const props = defineProps<{
    value: string[];
}>();
const { value } = toRefs(props);
</script>

<template>
    <div class="h-full overflow-auto relative">
        <ul class="list-disc list-inside whitespace-nowrap">
            <li v-for="item in value" :key="item">
                <a v-if="isLink(item)" class="text-blue-600 underline" :href="item" target="_blank">{{ item }}</a>
                <span v-else-if="isHtmlTag(item)" v-html="item"></span>
                <span v-else>{{ item }}</span>
            </li>
        </ul>
    </div>
</template>
