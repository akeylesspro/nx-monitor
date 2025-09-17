<script setup lang="ts">
import { Chart, ItemContainer } from "../../components";
import { useI18n } from "vue-i18n";

const mockData = [
    {
        lable: "Jan",
        value: 120,
    },
    {
        lable: "Feb",
        value: 150,
    },
    {
        lable: "Mar",
        value: 180,
    },
    {
        lable: "Apr",
        value: 130,
    },
    {
        lable: "May",
        value: 200,
    },
    {
        lable: "Jun",
        value: 240,
    },
    {
        lable: "Jul",
        value: 260,
    },
    {
        lable: "Aug",
        value: 280,
    },
    {
        lable: "Sep",
        value: 300,
    },
    {
        lable: "Oct",
        value: 320,
    },
    {
        lable: "Nov",
        value: 340,
    },
    {
        lable: "Dec",
        value: 30,
    },
];

const chartData = {
    labels: mockData.map((item) => item.lable),
    datasets: [
        {
            label: "",
            data: mockData.map((item) => item.value),
        },
    ],
};
const { t } = useI18n();
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 2xl:grid-cols-4 _3xl-grid gap-6  max-h-full">
        <ItemContainer>
            <template #default>
                <Chart :data="chartData" :title="t('common.traffic')" />
            </template>
        </ItemContainer>
        <ItemContainer>
            <template #default>
                <Chart :data="chartData" :title="t('common.traffic')" />
            </template>
        </ItemContainer>
        <ItemContainer>
            <template #default>
                <Chart :data="chartData" :title="t('common.traffic')" />
            </template>
        </ItemContainer>
        <ItemContainer>
            <template #default>
                <Chart :data="chartData" :title="t('common.traffic')" />
            </template>
        </ItemContainer>
        <ItemContainer>
            <template #default>
                <Chart :data="chartData" :title="t('common.traffic')" />
            </template>
        </ItemContainer>
        <ItemContainer>
            <template #default>
                <Chart :data="chartData" :title="t('common.traffic')" />
            </template>
        </ItemContainer>
        <ItemContainer>
            <template #default>
                <Chart :data="chartData" :title="t('common.traffic')" />
            </template>
        </ItemContainer>
        <ItemContainer>
            <template #default>
                <Chart :data="chartData" :title="t('common.traffic')" />
            </template>
        </ItemContainer>
    </div>
</template>
