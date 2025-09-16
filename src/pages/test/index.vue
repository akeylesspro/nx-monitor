<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMainStore } from "../../stores";

const mainStore = useMainStore();
const { name } = storeToRefs(mainStore);
</script>

<template>
    <div>
        <h1>Test</h1>
        <p>{{ name }}</p>
    </div>
</template>
