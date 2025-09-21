<script setup lang="ts">
import { toRefs } from "vue";
import { cn } from "../../../helpers";
import { useI18n } from "vue-i18n";

const props = defineProps<{
    title: string;
    timestamp?: string;
    classNames: Record<string, string>;
}>();
const { title, timestamp, classNames } = toRefs(props);
const { t } = useI18n();
</script>

<template>
    <div class="w-full flex flex-col gap-1">
        <div class="w-full flex items-end gap-2">
            <i :class="cn(classNames.icon)" class="text-3xl"></i>
            <span class="text-2xl font-bold">{{ title }}</span>
        </div>
        <div v-if="timestamp" class="w-full flex items-center gap-2 text-[gray]">
            <span>{{ t("common.updated") }}</span>
            <span dir="ltr">{{ timestamp }}</span>
        </div>
    </div>
</template>
