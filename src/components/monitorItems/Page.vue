<script setup lang="ts">
import { toRefs, computed } from "vue";
import { Container, ValueUi } from "@/components";
import { calculateStatus, getItemComponent, getItemProps } from "./helpers";
import { storeToRefs } from "pinia";
import { useCacheStore } from "@/stores";
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
        const itemType = item.type;
        const status =
            item.status ||
            calculateStatus(dataItem?.[valueKey], itemType, {
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
        <template v-for="item in processedItems" :key="item.name + item.title">
            <Container
                v-if="item.isValid"
                :title="item.title"
                :status="item.status"
                :timestamp="item.dataItem?.updated"
                :url="item.title_link"
                :type="item.type"
                :updatedThreshold="item.updated_thresholds"
            >
                <template #default>
                    <component :is="item.component" v-bind="item.props as any" />
                </template>
            </Container>
            <Container
                v-else
                :type="item.type"
                :title="item.title"
                :status="'error'"
                :timestamp="item.dataItem?.updated"
                :updatedThreshold="item.updated_thresholds"
            >
                <template #default>
                    <ValueUi :value="'error'" />
                </template>
            </Container>
        </template>
    </div>
</template>
