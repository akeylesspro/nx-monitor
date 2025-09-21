<script setup lang="ts">
import { toRefs } from "vue";
import { isLink } from "../helpers";

const props = defineProps<{
    value: any[];
}>();
const { value } = toRefs(props);

const columns = Object.keys(value.value[0]).map((key) => ({
    field: key,
    header: key.toCapitalCase(),
}));
</script>

<template>
    <div class="h-full overflow-auto relative">
        <table class="w-full border-collapse">
            <thead>
                <tr>
                    <th
                        v-for="col of columns"
                        :key="col.field"
                        class="sticky -top-px bg-[var(--color-bg)] text-[var(--color-text)] z-10 border-b-2 p-2 text-left border border-[var(--color-border)]"
                    >
                        {{ col.header }}
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in value" :key="product.code">
                    <td v-for="col of columns" :key="col.field" class="p-1 text-left border border-[var(--color-border)]">
                        <a v-if="isLink(product[col.field])" class="text-blue-600 underline" :href="product[col.field]" target="_blank">{{
                            product[col.field]
                        }}</a>
                        <span v-else>{{ product[col.field] }}</span>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>
