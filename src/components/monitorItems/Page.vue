<script setup lang="ts">
import { toRefs, computed } from "vue";
import { Container, ValueUi } from "@/components";
import { calculateStatus, getItemComponent, getItemProps } from "./helpers";
import { storeToRefs } from "pinia";
import { useCacheStore } from "@/stores";
import { timestampToString } from "@/helpers";
const props = defineProps<{
    pageName: string;
}>();
const { pageName } = toRefs(props);
const cacheStore = useCacheStore();
const { getMetaItems } = cacheStore;
const { dataItems, metaData } = storeToRefs(cacheStore);

const itemsMetaList = computed(() => getMetaItems(metaData.value, pageName.value));
const statusPriority = {
    critical: 0,
    error: 1,
    warning: 2,
    success: 3,
    info: 4,
};
const processedItems = computed(() => {
    const res = itemsMetaList.value.map((item) => {
        const component = getItemComponent(item);
        const dataItem = dataItems.value[item.name];
        const props = getItemProps(item, dataItem);
        const valueKey = item.value_key_ref || "value";
        const status =
            item.status ||
            calculateStatus(dataItem?.[valueKey], {
                updatedThresholds: item.updated_thresholds,
                valueThresholds: item.value_thresholds,
            });
        return {
            ...item,
            component,
            props,
            dataItem,
            status,
            isValid: component && props,
        };
    });

    return res.sort((a, b) => {
        const priorityA = statusPriority[a.status as keyof typeof statusPriority] ?? 999;
        const priorityB = statusPriority[b.status as keyof typeof statusPriority] ?? 999;
        return priorityA - priorityB;
    });
});
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 _3xl-grid gap-6 max-h-full">
        <template v-for="item in processedItems" :key="item.name + Math.random()">
            <Container
                v-if="item.isValid"
                :title="item.title"
                :status="item.status"
                :timestamp="timestampToString(item.dataItem?.updated as any)"
                :url="item.title_link"
                :type="item.type"
            >
                <template #default>
                    <component :is="item.component" v-bind="item.props as any" />
                </template>
            </Container>
            <Container v-else :type="item.type" :title="item.title" :status="'error'" :timestamp="timestampToString(item.dataItem?.updated as any)">
                <template #default>
                    <ValueUi :value="'error'" />
                </template>
            </Container>
        </template>
    </div>
</template>
