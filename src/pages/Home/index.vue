<script setup lang="ts">
import { Chart, ItemContainer } from "../../components";

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
            label: "Requests2",
            data: mockData.map((item) => item.value),
            fill: true,
            tension: 0.3,
        },
    ],
};
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 max-h-full">
        <ItemContainer>
            <template #default>
                <Chart :type="'bar'" :data="chartData" title="Traffic" class="h-full w-full" />
            </template>
        </ItemContainer>
        <ItemContainer>
            <template #default>
                <Chart :type="'bar'" :data="chartData" title="Traffic" class="h-full w-full" />
            </template>
        </ItemContainer>
        <ItemContainer>
            <template #default>
                <Chart :type="'bar'" :data="chartData" title="Traffic" class="h-full w-full" />
            </template>
        </ItemContainer>
        <ItemContainer>
            <template #default>
                <Chart :type="'bar'" :data="chartData" title="Traffic" class="h-full w-full" />
            </template>
        </ItemContainer>
        <ItemContainer>
            <template #default>
                <Chart :type="'bar'" :data="chartData" title="Traffic" class="h-full w-full" />
            </template>
        </ItemContainer>
        <ItemContainer>
            <template #default>
                <Chart :type="'bar'" :data="chartData" title="Traffic" class="h-full w-full" />
            </template>
        </ItemContainer>
        <ItemContainer>
            <template #default>
                <Chart :type="'bar'" :data="chartData" title="Traffic" class="h-full w-full" />
            </template>
        </ItemContainer>
        <ItemContainer>
            <template #default>
                <Chart :type="'bar'" :data="chartData" title="Traffic" class="h-full w-full" />
            </template>
        </ItemContainer>
    </div>
</template>
