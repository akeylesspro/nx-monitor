<script setup lang="ts">
import { Chart, Container, NumberUi } from "../../components";

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
</script>

<template>
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 _3xl-grid gap-6 max-h-full">
        <Container title="Cart" status="info" timestamp="2025-01-01 16:50:00">
            <template #default>
                <Chart :data="chartData" />
            </template>
        </Container>
        <Container title="Number Percentage" status="success" timestamp="2025-01-01 16:50:00">
            <template #default>
                <NumberUi :value="100" :format="'percentage'" />
            </template>
        </Container>
        <Container title="Number Currency" status="warning" timestamp="2025-01-01 16:50:00">
            <template #default>
                <NumberUi :value="5000" :format="'currency'" />
            </template>
        </Container>
        <Container title="Number Currency" status="error" timestamp="2025-01-01 16:50:00">
            <template #default>
                <NumberUi :value="-50" :format="'currency'" />
            </template>
        </Container>
        <Container title="Number Currency" status="critical" timestamp="2025-01-01 16:50:00">
            <template #default>
                <NumberUi :value="-50" :format="'currency'" />
            </template>
        </Container>
    </div>
</template>
