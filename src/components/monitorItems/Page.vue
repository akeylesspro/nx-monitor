<script setup lang="ts">
import { toRefs, computed } from "vue";
import { Container, ValueUi } from "@/components";
import { calculateStatus, getItemComponent, getItemProps, getDataList, getMetaList } from "./helpers";
const props = defineProps<{
    pageName: string;
}>();
const { pageName } = toRefs(props);
const itemsMetaList = getMetaList(pageName.value);
const itemsDataList = getDataList();
const statusPriority = {
    critical: 0,
    error: 1,
    warning: 2,
    success: 3,
    info: 4,
};
const processedItems = computed(() => {
    const res = itemsMetaList.map((item) => {
        const component = getItemComponent(item);
        const props = getItemProps(item, itemsDataList[item.name]);
        const itemData = itemsDataList[item.name];

        return {
            ...item,
            component,
            props,
            itemData,
            status:
                item.status ||
                calculateStatus(itemData.value, {
                    updatedThresholds: item.updated_thresholds,
                    valueThresholds: item.value_thresholds,
                }),
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
        <template v-for="item in processedItems" :key="item.name">
            <Container v-if="item.isValid" :title="item.title" :status="item.status" :timestamp="item.itemData?.updated" :url="item.title_link">
                <template #default>
                    <component :is="item.component" v-bind="item.props as any" />
                </template>
            </Container>
            <Container v-else :title="item.title" :status="'error'" :timestamp="item.itemData?.updated">
                <template #default>
                    <ValueUi :value="'error'" />
                </template>
            </Container>
        </template>
    </div>
</template>
